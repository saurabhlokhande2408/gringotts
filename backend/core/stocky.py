def get_multiple_prices(symbols: list[str]):
    from yahooquery import Ticker
    
    prices = {}
    if not symbols:
        return prices

    try:
        # Create Ticker object with all symbols at once
        t = Ticker(symbols)
        data = t.price

        for symbol in symbols:
            # 1. Get the data for this specific symbol
            symbol_data = data.get(symbol)

            # 2. Check if it's a dictionary (successful fetch)
            if isinstance(symbol_data, dict):
                # Try multiple common price keys just in case
                price = (
                    symbol_data.get("regularMarketPrice") or 
                    symbol_data.get("preMarketPrice") or 
                    symbol_data.get("postMarketPrice")
                )
                
                # 3. Ensure the price is a valid number
                if isinstance(price, (int, float)):
                    prices[symbol] = price
                else:
                    prices[symbol] = None
            else:
                # Symbol was invalid or Yahoo returned an error string
                prices[symbol] = None

    except Exception as e:
        print(f"Gringotts API Error: {e}")
        # Fallback: Mark all as None so the UI shows 'Unavailable' safely
        for symbol in symbols:
            prices[symbol] = None

    return prices