from fastapi import APIRouter, Response, status, Depends,Query
from typing import Annotated, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import insert, select, text, func, delete, update
from datetime import datetime

from app.classmodel.Kegiatan import *

from ..database.database import get_db

from ..database.models import * 
from ..classmodel import *

from ..depedency import validate_token



router = APIRouter(prefix="/kegiatan", tags=["Kegiatan"])

@router.get("/all", response_model=List[JSONKegiatanCard], summary="Get All Kegiatan")
def get_all_kegiatan(
    response: Response,
    user: Annotated[dict, Depends(validate_token)],
    db: Session = Depends(get_db)
):
    try:
        kegiatan_list = db.execute(
            select(Kegiatan)
            .order_by(Kegiatan.waktuDiupload.desc())
        ).scalars().all()
    except Exception as e:
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}

    if not kegiatan_list:
        return []

    data = []
    for k in kegiatan_list:
        data.append({
            "idKegiatan": k.idKegiatan,
            "nama": k.nama,
            "jenis": k.jenis,
            "nama_instansi": k.instansi.nama,
            "TAK_wajib": k.TAK_wajib,
            "status_kegiatan": k.status_kegiatan,
            "waktu": k.waktu,
            "waktuDiupload": k.waktuDiupload,
            "views": k.views,
            "pemohon": (k.admin_instansi.username if k.admin_instansi else None),
            "minat": [{"idMinat": m.idMinat, "nama_minat": m.nama} for m in k.minat_list],
            "bakat": [{"idBakat": b.idBakat, "nama_bakat": b.nama} for b in k.bakat_list]
        })
    
    return data

@router.post('/upload',status_code=200)
def upload_kegiatan(request: JSONKegiatanCreate, user: Annotated[dict, Depends(validate_token)], response: Response, db: Session = Depends(get_db)):

    if user["role"] != "AdminInstansi":
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"message": "anda tidak dapat mengunakan layanan ini"}

    try:
        query = db.execute(select(AdminInstansi.idAdminInstansi, AdminInstansi.idInstansi).where(AdminInstansi.username == user['username'])).first()
    except Exception as e:
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}
    
    if not query:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"message": "admin instansi tidak ditemukan"}

    idAdminInstansi = query[0]
    idInstansi = query[1]

    try:
        w = request.waktu
        if isinstance(w, datetime):
            waktu_dt = w
        else:
            s = str(w).strip()
            if not s: raise ValueError("empty waktu")
            if s.endswith("Z"): s = s[:-1] + "+00:00"
            if len(s) == 10 and s[4] == '-' and s[7] == '-': s = f"{s}T00:00:00"
            if 'T' in s:
                parts = s.split('T')
                time = parts[1]
                if time and len(time) == 5 and time[2] == ':': s = f"{parts[0]}T{time}:00"
            waktu_dt = datetime.fromisoformat(s)
    except Exception:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "format waktu salah, gunakan ISO datetime"}
    

    final_id_lampiran = request.idLampiran
    if final_id_lampiran == 0:
        final_id_lampiran = None

    try:

        new_kegiatan = Kegiatan(
            nama=request.nama,
            jenis=request.jenis,
            deskripsi=request.deskripsi,
            waktu=waktu_dt,
            nominal_TAK=request.nominal_TAK,
            TAK_wajib=request.TAK_wajib,
            status_kegiatan='Pending', 
            waktuDiupload=datetime.now(), 
            idAdminInstansi=idAdminInstansi,
            idInstansi=idInstansi,
            idLampiran=final_id_lampiran 
        )
        
        db.add(new_kegiatan)
        db.flush()
        db.refresh(new_kegiatan) 

        if request.minat_id:
            for m_id in request.minat_id:
                stmt = text("INSERT INTO minatKegiatan (idKegiatan, idMinat) VALUES (:k, :m)")
                db.execute(stmt, {"k": new_kegiatan.idKegiatan, "m": m_id})
        if request.bakat_id:
            for b_id in request.bakat_id:
                stmt = text("INSERT INTO bakatKegiatan (idKegiatan, idBakat) VALUES (:k, :b)")
                db.execute(stmt, {"k": new_kegiatan.idKegiatan, "b": b_id})

        db.commit() 

    except Exception as e:
        db.rollback() 
        print(f"ERROR DATABASE DETAIL: {e}") 
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": f"Gagal menyimpan data: {str(e)}"}

    return {"message": "kegiatan berhasil diupload, status: Pending"}


def serialize_kegiatan(obj: Kegiatan) -> dict:
    return {
        "idKegiatan": obj.idKegiatan,
        "nama": obj.nama,
        "jenis": obj.jenis,
        "deskripsi": obj.deskripsi,
        "waktu": obj.waktu.isoformat() if obj.waktu else None,
        "nominal_TAK": obj.nominal_TAK,
        "TAK_wajib": bool(obj.TAK_wajib),
        "status_kegiatan": obj.status_kegiatan,
        "waktuDiupload": obj.waktuDiupload.isoformat() if obj.waktuDiupload else None,
        "idAdminPengawas": obj.idAdminPengawas,
        "idAdminInstansi": obj.idAdminInstansi,
        "idInstansi": obj.idInstansi,
        "idLampiran": obj.idLampiran
    }

@router.post('/edit/{id}', status_code=200)
def edit_kegiatan(id: int, request: JSONKegiatanUpdate, user: Annotated[dict, Depends(validate_token)], response: Response, db: Session = Depends(get_db)):
    if user["role"] != "AdminInstansi":
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"message": "anda tidak dapat mengunakan layanan ini"}
    
    try:
        query = db.execute(select(AdminInstansi.idInstansi).where(AdminInstansi.username == user['username'])).first()
    except Exception as e:
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}
    
    if not query:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"message": "admin instansi tidak ditemukan"}
    
    idInstansiUser = query[0]

    try:
        exists = db.execute(select(Kegiatan.idKegiatan).where(
            Kegiatan.idKegiatan == id,
            Kegiatan.idInstansi == idInstansiUser 
        )).first()
    except Exception as e:
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}
        
    if not exists:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"message": "kegiatan tidak ditemukan atau bukan milik instansi anda"}

    try:
        waktu_dt = None
        if request.waktu is not None:
            if isinstance(request.waktu, datetime):
                waktu_dt = request.waktu
            else:
                waktu_dt = datetime.fromisoformat(str(request.waktu))
    except Exception:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "format waktu salah, gunakan ISO datetime"}

    try:
        db.execute(text("""
            UPDATE Kegiatan SET
                nama = :nama,
                jenis = COALESCE(:jenis, jenis),
                deskripsi = :deskripsi,
                waktu = COALESCE(:waktu, waktu),
                nominal_TAK = :nominal_TAK,
                TAK_wajib = :TAK_wajib,
                idLampiran = :idLampiran
            WHERE idKegiatan = :id
        """), {
            "nama": request.nama,
            "jenis": request.jenis,
            "deskripsi": request.deskripsi,
            "waktu": waktu_dt,
            "nominal_TAK": request.nominal_TAK,
            "TAK_wajib": request.TAK_wajib,
            "idLampiran": request.idLampiran,
            "id": id
        })


        if request.minat_id is not None:
            db.execute(text("DELETE FROM minatKegiatan WHERE idKegiatan = :id"), {"id": id})
            for m_id in request.minat_id:
                db.execute(text("INSERT INTO minatKegiatan (idKegiatan, idMinat) VALUES (:k, :m)"), {"k": id, "m": m_id})

        if request.bakat_id is not None:
            db.execute(text("DELETE FROM bakatKegiatan WHERE idKegiatan = :id"), {"id": id})
            for b_id in request.bakat_id:
                db.execute(text("INSERT INTO bakatKegiatan (idKegiatan, idBakat) VALUES (:k, :b)"), {"k": id, "b": b_id})

        db.commit()

    except Exception as e:
        db.rollback()
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}
    
    return {"message": "kegiatan berhasil diupdate"}


@router.delete('/{id}', status_code=200) 
def delete_kegiatan(id: int, user: Annotated[dict, Depends(validate_token)], response: Response, db: Session = Depends(get_db)):

    if user["role"] != "AdminInstansi":
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"message": "anda tidak dapat mengunakan layanan ini"}

    try:
        query = db.execute(select(AdminInstansi.idInstansi).where(AdminInstansi.username == user['username'])).first()
    except Exception as e:
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}
    
    if not query:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"message": "admin instansi tidak ditemukan"}
    
    idInstansiUser = query[0]
    try:
        exists = db.execute(select(Kegiatan.idKegiatan).where(
            Kegiatan.idKegiatan == id,
            Kegiatan.idInstansi == idInstansiUser 
        )).first()
    except Exception as e:
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}
        
    if not exists:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"message": "kegiatan tidak ditemukan atau bukan milik instansi anda"}

    try:
        db.execute(text("DELETE FROM minatKegiatan WHERE idKegiatan = :id"), {"id": id})
        db.execute(text("DELETE FROM bakatKegiatan WHERE idKegiatan = :id"), {"id": id})
        db.execute(text("DELETE FROM Simpan WHERE idKegiatan = :id"), {"id": id})
        db.execute(text("DELETE FROM Kegiatan WHERE idKegiatan = :id"), {"id": id})
        
        db.commit()
    except Exception as e:
        db.rollback() 
        print(f"ERROR DELETE: {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": f"Gagal menghapus data: {str(e)}"}
    
    return {"message": "kegiatan berhasil dihapus"}


@router.get("/filter", response_model=List[JSONKegiatanCard], summary="Filter & Search Kegiatan")
def filter_search_kegiatan(
    response: Response,
    user: Annotated[dict, Depends(validate_token)],
    search: str = Query(default="", description="Cari berdasarkan nama kegiatan"),
    jenis: Optional[str] = Query(None, description="Filter berdasarkan jenis: Seminar, Webinar, Bootcamp, Lomba"),
    minat_ids: List[int] = Query(default=[], description="List ID minat"),
    sort: Optional[str] = Query(None, description="Sort by: latest, popular, or all"),
    bakat_ids: List[int] = Query(default=[], description="List ID bakat"),
    db: Session = Depends(get_db)
):
    now = datetime.now()
    
    if not minat_ids and not bakat_ids:
        try:
            query = select(Kegiatan).where(
                Kegiatan.status_kegiatan == "Approved", 
                Kegiatan.waktu > now
            )
            
            if search:
                query = query.where(Kegiatan.nama.ilike(f"%{search}%"))

            if jenis:
                query = query.where(Kegiatan.jenis == jenis)
            
            if sort == "popular":
                query = query.order_by(Kegiatan.views.desc())
            elif sort == "latest":
                query = query.order_by(Kegiatan.waktu.asc())
            
            
            kegiatan_list = db.execute(query).scalars().all()
        except Exception as e:
            print(f"ERROR : {e}")
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return {"message": "error pada sambungan database"}
    else:
        try:
            kegiatan_by_minat = set()
            if minat_ids:
                query = (
                    select(Kegiatan)
                    .join(minatKegiatan, Kegiatan.idKegiatan == minatKegiatan.c.idKegiatan)
                    .where(
                        Kegiatan.status_kegiatan == "Approved",
                        Kegiatan.waktu > now,
                        minatKegiatan.c.idMinat.in_(minat_ids)
                    )
                )
                if search:
                    query = query.where(Kegiatan.nama.ilike(f"%{search}%"))
                if jenis:
                    query = query.where(Kegiatan.jenis == jenis)
                
                
                result = db.execute(query).scalars().all()
                kegiatan_by_minat = set(result)
            
            kegiatan_by_bakat = set()
            if bakat_ids:
                query = (
                    select(Kegiatan)
                    .join(bakatKegiatan, Kegiatan.idKegiatan == bakatKegiatan.c.idKegiatan)
                    .where(
                        Kegiatan.status_kegiatan == "Approved",
                        Kegiatan.waktu > now,
                        bakatKegiatan.c.idBakat.in_(bakat_ids)
                    )
                )
                if search:
                    query = query.where(Kegiatan.nama.ilike(f"%{search}%"))
                
                if jenis:
                    query = query.where(Kegiatan.jenis == jenis)
                
                result = db.execute(query).scalars().all()
                kegiatan_by_bakat = set(result)

            kegiatan_list = list(kegiatan_by_minat | kegiatan_by_bakat)

            if sort == "popular":
                kegiatan_list.sort(key=lambda x: x.views, reverse=True)
            elif sort == "latest":
                kegiatan_list.sort(key=lambda x: x.waktu)
            
        except Exception as e:
            print(f"ERROR : {e}")
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return {"message": "error pada sambungan database"}

    if not kegiatan_list:
        return []

    data = []
    for k in kegiatan_list:
        data.append({
            "idKegiatan": k.idKegiatan,
            "nama": k.nama,
            "jenis": k.jenis,
            "nama_instansi": k.instansi.nama,
            "TAK_wajib": k.TAK_wajib,
            "status_kegiatan": k.status_kegiatan,
            "waktu": k.waktu,
            "waktuDiupload": k.waktuDiupload,
            "views": k.views,
            "minat": [{"idMinat": m.idMinat, "nama_minat": m.nama} for m in k.minat_list],
            "bakat": [{"idBakat": b.idBakat, "nama_bakat": b.nama} for b in k.bakat_list]
        })
    
    return data

@router.get("/fyp", response_model=List[JSONKegiatanCard], summary="For You Page")
def get_fyp_kegiatan(
    response: Response,
    user: Annotated[dict, Depends(validate_token)],
    sort: Optional[str] = Query(None, description="Sort by: latest, popular, or all"),
    db: Session = Depends(get_db)
):
    now = datetime.now()
    
    if user["role"] != "Pengguna":
        response.status_code = status.HTTP_403_FORBIDDEN
        return {"message": "Hanya pengguna yang dapat melihat FYP"}

    try:
        pengguna = db.execute(
            select(Pengguna).where(Pengguna.username == user["username"])
        ).scalar_one_or_none()
        
        if not pengguna:
            response.status_code = status.HTTP_404_NOT_FOUND
            return {"message": "Pengguna tidak ditemukan"}
    except Exception as e:
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}

    minat_ids = [m.idMinat for m in pengguna.minat_list]
    bakat_ids = [b.idBakat for b in pengguna.bakat_list]

    try:
        kegiatan_prioritas = set()
        if minat_ids:
            result = db.execute(
                select(Kegiatan)
                .join(minatKegiatan, Kegiatan.idKegiatan == minatKegiatan.c.idKegiatan)
                .where(
                    Kegiatan.status_kegiatan == "approved",
                    Kegiatan.waktu > now,
                    minatKegiatan.c.idMinat.in_(minat_ids)
                )
            ).scalars().all()
            kegiatan_prioritas.update(result)
        
        if bakat_ids:
            result = db.execute(
                select(Kegiatan)
                .join(bakatKegiatan, Kegiatan.idKegiatan == bakatKegiatan.c.idKegiatan)
                .where(
                    Kegiatan.status_kegiatan == "approved",
                    Kegiatan.waktu > now,
                    bakatKegiatan.c.idBakat.in_(bakat_ids)
                )
            ).scalars().all()
            kegiatan_prioritas.update(result)

        semua_kegiatan = db.execute(
            select(Kegiatan).where(
                Kegiatan.status_kegiatan == "Approved",
                Kegiatan.waktu > now
            )
        ).scalars().all()

        prioritas_ids = {k.idKegiatan for k in kegiatan_prioritas}
        kegiatan_sisa = [k for k in semua_kegiatan if k.idKegiatan not in prioritas_ids]

        kegiatan_prioritas_list = list(kegiatan_prioritas)

        if sort == "popular":
            kegiatan_prioritas_list.sort(key=lambda x: x.views, reverse=True)
            kegiatan_sisa.sort(key=lambda x: x.views, reverse=True)
        elif sort == "latest":
            kegiatan_prioritas_list.sort(key=lambda x: x.waktu)
            kegiatan_sisa.sort(key=lambda x: x.waktu)

        kegiatan_list = kegiatan_prioritas_list + kegiatan_sisa

    except Exception as e:
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}

    if not kegiatan_list:
        return []

    data = []
    for k in kegiatan_list:
        data.append({
            "idKegiatan": k.idKegiatan,
            "nama": k.nama,
            "jenis": k.jenis,
            "nama_instansi": k.instansi.nama,
            "TAK_wajib": k.TAK_wajib,
            "status_kegiatan": k.status_kegiatan,
            "waktu": k.waktu,
            "waktuDiupload": k.waktuDiupload,
            "views": k.views,
            "minat": [{"idMinat": m.idMinat, "nama_minat": m.nama} for m in k.minat_list],
            "bakat": [{"idBakat": b.idBakat, "nama_bakat": b.nama} for b in k.bakat_list]
        })
    
    return data


@router.get("/pending", response_model=List[JSONKegiatanCard], summary="Get Pending Kegiatan (Admin Pengawas Only)")
def get_pending_kegiatan(
    response: Response,
    user: Annotated[dict, Depends(validate_token)],
    db: Session = Depends(get_db)
):
    if user["role"] != "AdminPengawas":
        response.status_code = status.HTTP_403_FORBIDDEN
        return {"message": "Hanya admin pengawas yang dapat mengakses endpoint ini"}

    try:
        kegiatan_list = db.execute(
            select(Kegiatan)
            .where(Kegiatan.status_kegiatan == "Pending")
            .order_by(Kegiatan.waktuDiupload.desc())
        ).scalars().all()
    except Exception as e:
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}

    if not kegiatan_list:
        return []

    data = []
    for k in kegiatan_list:
        data.append({
            "idKegiatan": k.idKegiatan,
            "nama": k.nama,
            "jenis": k.jenis,
            "nama_instansi": k.instansi.nama,
            "TAK_wajib": k.TAK_wajib,
            "status_kegiatan": k.status_kegiatan,
            "waktu": k.waktu,
            "waktuDiupload": k.waktuDiupload,
            "views": k.views,
            "minat": [{"idMinat": m.idMinat, "nama_minat": m.nama} for m in k.minat_list],
            "bakat": [{"idBakat": b.idBakat, "nama_bakat": b.nama} for b in k.bakat_list]
        })
    
    return data

@router.get("/instansi", response_model=List[JSONKegiatanCard])
def get_kegiatan_by_instansi(
    response: Response,
    user: Annotated[dict, Depends(validate_token)],
    db: Session = Depends(get_db)
):
    if user["role"] != "AdminInstansi":
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"message": "anda tidak dapat mengunakan layanan ini"}
    try: 
        query = db.execute(
            select(AdminInstansi.idInstansi).where(AdminInstansi.username == user['username'])
        ).first()
    except Exception as e:
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}
    if not query:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"message": "admin instansi tidak ditemukan"}
    
    idInstansi = query[0]

    try:
        kegiatan_list = db.execute(
            select(Kegiatan)
            .where(Kegiatan.idInstansi == idInstansi)
            .order_by(Kegiatan.waktuDiupload.desc())
        ).scalars().all()
    except Exception as e:
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}

    if not kegiatan_list:
        return []

    data = []
    for k in kegiatan_list:
        data.append({
            "idKegiatan": k.idKegiatan,
            "nama": k.nama,
            "jenis": k.jenis,
            "nama_instansi": k.instansi.nama,
            "TAK_wajib": k.TAK_wajib,
            "status_kegiatan": k.status_kegiatan,
            "waktu": k.waktu,
            "waktuDiupload": k.waktuDiupload,
            "views": k.views if k.views is not None else 0, 
            "minat": [{"idMinat": m.idMinat, "nama_minat": m.nama} for m in k.minat_list],
            "bakat": [{"idBakat": b.idBakat, "nama_bakat": b.nama} for b in k.bakat_list]})

    return data


@router.get("/{idKegiatan}", response_model=JSONKegiatanDetail, summary="Get Detail Kegiatan")
def get_detail_kegiatan(
    idKegiatan: int,
    response: Response,
    user: Annotated[dict, Depends(validate_token)],
    skip_views: bool = Query(default=False, description="Jangan tambah jumlah views"),
    db: Session = Depends(get_db)
):
    
    try:
        kegiatan = db.execute(
            select(Kegiatan).where(Kegiatan.idKegiatan == idKegiatan)
        ).scalar_one_or_none()
        
        if not kegiatan:
            response.status_code = status.HTTP_404_NOT_FOUND
            return {"message": "Kegiatan tidak ditemukan"}
        
        if not skip_views:
            kegiatan.views = (kegiatan.views or 0) + 1
            db.commit()
            db.refresh(kegiatan)
        
        return {
            "idKegiatan": kegiatan.idKegiatan,
            "nama": kegiatan.nama,
            "jenis": kegiatan.jenis,
            "deskripsi": kegiatan.deskripsi,
            "waktu": kegiatan.waktu,
            "nominal_TAK": kegiatan.nominal_TAK,
            "TAK_wajib": kegiatan.TAK_wajib,
            "status_kegiatan": kegiatan.status_kegiatan,
            "waktuDiupload": kegiatan.waktuDiupload,
            "views": kegiatan.views,
            "nama_instansi": kegiatan.instansi.nama,
            "idAdminInstansi": kegiatan.idAdminInstansi,
            "lampiran": {
                "idLampiran": kegiatan.lampiran.idLampiran,
                "nama": kegiatan.lampiran.nama,
                "jenis": kegiatan.lampiran.jenis,
                "ukuran": kegiatan.lampiran.ukuran,
                "folder": kegiatan.lampiran.folder
            } if kegiatan.lampiran else None,
            "minat": [{"idMinat": m.idMinat, "nama_minat": m.nama} for m in kegiatan.minat_list],
            "bakat": [{"idBakat": b.idBakat, "nama_bakat": b.nama} for b in kegiatan.bakat_list]
        }
        
    except Exception as e:
        print(f"ERROR : {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error pada sambungan database"}


