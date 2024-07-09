import React, { useState, useEffect } from "react";
import { getCategories, list } from "./apiCore";
import Card from "./Card";

const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: "",
        search: "",
        results: [],
        searched: false
    });

    const [recommendData, setRecommendData] = useState({
        recommendedBooks: []
    });

    const { categories, category, search, results, searched } = data;
    const { recommendedBooks } = recommendData;

    const loadCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setData({ ...data, categories: data });
            }
        });
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const searchRecommendations = async (bookName) => {
        try {
            const book_name = bookName.toLowerCase() 
            const response = await fetch(`http://localhost:5000/recommend?book_name=${book_name}`);
            if (!response.ok) {
                throw new Error(await response.json());
            }
            const result = await response.json();
            setRecommendData({ recommendedBooks: result.recommendations || [] });
            } catch (error) {
                // console.error("Not Found: ", error);
                setRecommendData({ recommendedBooks: [] });
        }
    };

    const searchData = () => {
        // console.log(search, category);
        if (search) {
            list({ search: search || undefined, category: category }).then(
                response => {
                    if (response.error) {
                        console.log(response.error);
                    } else {
                        setData({ ...data, results: response, searched: true });
                    }
                }
            );
        }
    };

    const searchSubmit = e => {
        e.preventDefault();
        searchData();
        searchRecommendations(search);
    };

    const handleChange = name => event => {
        setData({ ...data, [name]: event.target.value, searched: false });
    };

    const searchMessage = (searched, results) => {
        if(searched && results.length > 0)
        {
            return `Found ${results.length} products`
        }

        // no products found
        if(searched && results.length < 1)
        {
            return `No Products Found`
        }

    }

    const searchedProducts = (results = []) => {
        return (
            <div>
                <h2 className="mt-4 mb-4">
                    {searchMessage(searched, results)}    
                </h2>    
                <div className="row">
                    {results.map((product, i) => (
                        <Card key={i} product={product} />
                    ))}
                </div>
            </div>
        );
    };

    const toggleDropdown = () => {
        const dropdownMenu = document.getElementById("recommendedDropdown");
        dropdownMenu.classList.toggle("show");
    };

    const recommendedDropdown = () => (
        <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleDropdown}>
                Recommended Books
            </button>
            <div className="dropdown-menu" id="recommendedDropdown">
                {recommendedBooks.map((book, index) => (
                    <a className="dropdown-item" href="#" key={index}>{book}</a>
                ))}
            </div>
        </div>
    );

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select
                            className="btn mr-2"
                            onChange={handleChange("category")}
                        >
                            <option value="All">All Categories</option>
                            {categories.map((c, i) => (
                                <option key={i} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="search"
                        className="form-control"
                        onChange={handleChange("search")}
                        placeholder="Search by name"
                    />
                </div>
                <div
                    className="btn input-group-append"
                    style={{ border: "none" }}
                >
                    <button className="input-group-text">Search</button>
                </div>
            </span>
        </form>
    );

    return (
        <div className="row">
            <div className="container mb-3">{searchForm()}</div>
            <div className="container-fluid mb-3">
                {searchedProducts(results)}
                {searched && recommendedBooks.length > 0 && recommendedDropdown()}
            </div>
        </div>
    );
};

export default Search;