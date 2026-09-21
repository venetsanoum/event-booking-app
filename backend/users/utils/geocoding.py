from geopy.geocoders import Nominatim

def get_coordinates(address, city, country):
    geolocator=Nominatim(user_agent="event_booking_app", timeout=10)
    location=geolocator.geocode(f"{address}, {city}, {country}")
    if location is None:
        return None, None
    return location.latitude, location.longitude
# if __name__ == "__main__":
#     lat, lon = get_coordinates(
#         "Fulton Alley 01027",
#         "San Juan de Dios",
#         "Costa Rica"
#     )

#     print("Latitude:", lat)
#     print("Longitude:", lon)