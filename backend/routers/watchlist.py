from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from db.models import User
from schemas.user import UserCreate
from schemas.watchlist import WatchlistCreate
from core.deps import get_current_user
from db.models import Watchlist
from core.stocky import get_multiple_prices


router=APIRouter()
'''
Router = where endpoints live

here only auth tokens can enter

'''
@router.post("/watchlist")
def add_to_watchlist(
    data: WatchlistCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    # get email from token
    email = current_user

    # find user
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    #create new item in watch list
    new_item = Watchlist(
        user_id=user.id,
        symbol=data.symbol
    )

    # save to DB
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {
        "message": "Stock added to watchlist",
        "symbol": new_item.symbol
    }

@router.get("/watchlist")
def get_watchlist(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    # get email from token
    email = current_user

    # find user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # fetch watchlist items
    items = db.query(Watchlist).filter(Watchlist.user_id == user.id).all()

    #  handle empty watchlist (important UX)
    if not items:
        return []

    symbols = [item.symbol for item in items]

    # fetch prices
    prices = get_multiple_prices(symbols)

    response = []

    for item in items:
        price = prices.get(item.symbol)

        response.append({
            "id": item.id,
            "symbol": item.symbol,
            "price": price,
            "status": "ok" if price is not None else "unavailable"
        })

    return response

@router.delete("/watchlist/{id}")
def delete_watchlist_item(
    id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    # get email from token
    email = current_user

    # find user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # find item that belongs to this user
    item = db.query(Watchlist).filter(
        Watchlist.id == id,
        Watchlist.user_id == user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # delete
    db.delete(item)
    db.commit()

    return {"message": "Deleted successfully"}