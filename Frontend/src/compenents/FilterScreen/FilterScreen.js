import React, { useState } from 'react';

const FilterScreen = () => {
    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        jobType: 'all',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement the filter logic here
        console.log('Filters applied:', filters);
    };

    return (
        <div className="filter-screen">
            <h2>Filter Jobs</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Keyword:</label>
                    <input
                        type="text"
                        name="keyword"
                        value={filters.keyword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={filters.location}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Job Type:</label>
                    <select
                        name="jobType"
                        value={filters.jobType}
                        onChange={handleChange}
                    >
                        <option value="all">All</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                    </select>
                </div>
                <button type="submit">Apply Filters</button>
            </form>
        </div>
    );
};

export default FilterScreen;