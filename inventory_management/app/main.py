# app/main.py
from fastapi import FastAPI
from app.routers import auth_router  # ensure package import
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, FastAPI
from app.routers.product_router import router as product_router
from app.routers.category_router import router as category_router
from app.routers.supplier_router import router as supplier_router
from app.routers.sale_router import router as sale_router
from app.routers.sale_item_router import router as sale_item_router
from app.routers.audit_router import router as audit_router
from app.routers.report_router import router as report_router
from app.routers.admin_router import router as admin_router
from app.routers.dashboard_router import router as dashboard_router

from fastapi import FastAPI
from app.database.database import Base, engine
from app.events import audit_listeners
from app.models import *
from app.routers.purchase_router import  router as purchase_router
from sqlalchemy import event
from app.events.audit_events import register_audit_events
from fastapi.middleware.cors import CORSMiddleware



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# Register audit listeners for all models except AuditLog itself
# for mapper in Base.registry.mappers:
#     cls = mapper.class_
#     if hasattr(cls, "__tablename__") and cls.__tablename__ != "audit_logs":
#         event.listen(cls, "after_insert", audit_listeners.after_insert)
#         event.listen(cls, "after_update", audit_listeners.after_update)
#         event.listen(cls, "after_delete", audit_listeners.after_delete)



app = FastAPI(title="Inventory Management API",description="FastAPI Project with JWT Auth",
    version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(auth_router.router)
app.include_router(product_router)
app.include_router(category_router)
app.include_router(supplier_router)
app.include_router(sale_router)
app.include_router(sale_item_router)
app.include_router(audit_router)
app.include_router(report_router)
app.include_router(purchase_router)
app.include_router(admin_router)
app.include_router(dashboard_router)

# register_audit_events()
