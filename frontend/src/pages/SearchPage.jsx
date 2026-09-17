import { searchEvents } from "../api/eventsApi";
import { Box, TextField, CircularProgress, Typography, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, Popover, IconButton, Slider, Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useState, useEffect } from "react";
import SearchCard from "../components/SearchCard";
import { getCategories, getCities } from "../api/eventsApi";

const SearchPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({
        search_bar: '',
        category: [],
        city: '',
        from_date: '',
        min_price: '',
        max_price: '',
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await searchEvents(filters);
                setEvents(response.data.results);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης εκδηλώσεων:', err);
                setError('Δεν ήταν δυνατή η φόρτωση εκδηλώσεων.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [filters]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const responseCategories = await getCategories();
                setCategories(responseCategories.data);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης κατηγοριών:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const [priceAnchor, setPriceAnchor] = useState(null);
    const [dateAnchor, setDateAnchor] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 200]);

    const handleCategoryChange = (e) => {
        setFilters({
            ...filters,
            category: e.target.value,
        });
    };

    const handlePriceCommit = (e, newValue) => {
        setPriceRange(newValue);
        setFilters({
            ...filters,
            min_price: newValue[0],
            max_price: newValue[1],
        });
    };

    const [locationAnchor, setLocationAnchor] = useState(null);
    const [cities, setCities] = useState([]);
    const [citySearch, setCitySearch] = useState('');
    
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await getCities();
                setCities(response.data);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης πόλεων:', err);
            }
        };
        fetchCities();
    }, []);

    const handleCityChange = (e) => {
        setFilters({
            ...filters,
            city: e.target.value,
        });
    };

    const filteredCities = cities.filter((c) =>
        c.toLowerCase().includes(citySearch.toLowerCase())
    );

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", padding: "60px" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography sx={{ color: "#d32f2f", fontSize: "18px", textAlign: "center", padding: "60px" }}>
                {error}
            </Typography>
        );
    }


    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "40px",
                padding: "40px",
            }}
        >
            <Typography sx={{ color: "black", fontSize: "50px", fontWeight: "600" }}>
                Αναζήτηση Εκδηλώσεων
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    width: "905px",
                    paddingBottom: "10px",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        padding: "20px 10px",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "25px",
                        alignSelf: "stretch"
                    }}
                >  
                    <TextField
                        name="search_bar"
                        label="Αναζήτηση..."
                        value={filters.search_bar}
                        onChange={handleFilterChange}
                        sx={{
                            width: "890px",
                            borderRadius: "5px",
                            background: "#FFF",
                            boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                            "& .MuiInputBase-input": {
                                fontSize: "24px",
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "24px",
                            },
                            "& .MuiOutlinedInput-notchedOutline legend": {
                                fontSize: "18px",  
                            },
                        }}
                    />
                </Box>
                <Box
                   sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                   }} 
                >
                    <Select
                        multiple
                        displayEmpty
                        value={filters.category}
                        onChange={handleCategoryChange}
                        input={<OutlinedInput sx={{ background: "#FFF", borderRadius: "5px" }} />}
                        renderValue={(selected) =>
                            selected.length === 0
                                ? "Κατηγορία"
                                : `${selected.length} επιλεγμένες`
                        }
                        sx={{ 
                            width: "215px",
                            borderRadius: "10px",
                            border: "3px solid #FFF",
                            background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                        }}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                <Checkbox checked={filters.category.indexOf(cat.id) > -1} />
                                <ListItemText primary={cat.name} />
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        multiple
                        displayEmpty
                        value={filters.city}
                        onChange={handleCityChange}
                        input={<OutlinedInput sx={{ background: "#FFF", borderRadius: "5px" }} />}
                        renderValue={(selected) =>
                            selected.length === 0 ? "Περιοχές" : `${selected.length} επιλεγμένες`
                        }
                        MenuProps={{
                            autoFocus: false,
                        }}
                        onClose={() => setCitySearch('')}
                        sx={{ width: "220px" }}
                    >
                        <Box sx={{ padding: "8px" }} onKeyDown={(e) => e.stopPropagation()}>
                            <TextField
                                placeholder="Αναζήτηση..."
                                value={citySearch}
                                onChange={(e) => setCitySearch(e.target.value)}
                                fullWidth
                                autoFocus
                                size="small"
                            />
                        </Box>

                        {filteredCities.map((cityName) => (
                            <MenuItem key={cityName} value={cityName}>
                                <Checkbox checked={filters.city.indexOf(cityName) > -1} />
                                <ListItemText primary={cityName} />
                            </MenuItem>
                        ))}
                    </Select>
                    <Box>
                        <Button
                            onClick={(e) => setDateAnchor(e.currentTarget)}
                            startIcon={<CalendarMonthIcon />}
                            sx={{ background: "#FFF", borderRadius: "5px", padding: "15px 20px", color: "black" }}
                        >
                            {filters.from_date || "Ημερομηνία"}
                        </Button>
                        <Popover
                            open={Boolean(dateAnchor)}
                            anchorEl={dateAnchor}
                            onClose={() => setDateAnchor(null)}
                        >
                            <Box sx={{ padding: "16px" }}>
                                <TextField
                                    name="from_date"
                                    type="date"
                                    value={filters.from_date}
                                    onChange={handleFilterChange}
                                />
                            </Box>
                        </Popover>
                    </Box>
                    <Box>
                        <Button
                            onClick={(e) => setPriceAnchor(e.currentTarget)}
                            sx={{ background: "#FFF", borderRadius: "5px", padding: "15px 20px", color: "black" }}
                        >
                            Τιμή: {priceRange[0]}€ - {priceRange[1]}€
                        </Button>
                        <Popover
                            open={Boolean(priceAnchor)}
                            anchorEl={priceAnchor}
                            onClose={() => setPriceAnchor(null)}
                        >
                            <Box sx={{ padding: "24px", width: "260px" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                    <Typography sx={{ fontWeight: 600 }}>{priceRange[0]}€</Typography>
                                    <Typography sx={{ fontWeight: 600 }}>{priceRange[1]}€</Typography>
                                </Box>
                                <Slider
                                    value={priceRange}
                                    onChange={(e, newValue) => setPriceRange(newValue)}
                                    onChangeCommitted={handlePriceCommit}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={500}
                                />
                            </Box>
                        </Popover>
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    width: "100%",
                    maxWidth: "900px",
                }}
            >
                {events.map((event) => (
                    <SearchCard
                        key={event.id}
                        event_photo={event.main_photo}
                        title={event.title}
                        date_start={new Date(event.startDateTime).toLocaleDateString('el-GR')}
                        date_end={new Date(event.endDateTime).toLocaleDateString('el-GR')}
                        address={`${event.venue}, ${event.city}`}
                        lowest_price={event.lowest_price}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default SearchPage;

