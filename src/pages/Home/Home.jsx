import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { fetchAllCategories, fetchAllProducts } from "../../api/apiCalls";
import { base_url, base_url_photo } from "../../api/config";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import HandelRemoteLayout from "../../components/HandelRemoteOutput";

export default function Home(props) {
  const [categories, setCategories] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState(null);
  const [laoding, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState(null);
  const pages = useRef(0);

  const nextPage = () => {
    if (currentPage < pages.current) {
      setCurrentPage((prevState) => prevState + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevState) => prevState - 1);
    }
  };
  const clearFilterOptions = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
  };
  const loadCategories = useCallback(async () => {
    try {
      const res = await fetchAllCategories();

      setCategories(res.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllProducts(
        activeCategory,
        currentPage,
        searchQuery,
        minPrice,
        maxPrice,
        sortField,
        sortOrder
      );
      pages.current = res.pages;
      setProducts(res.data);
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [
    activeCategory,
    currentPage,
    searchQuery,
    minPrice,
    maxPrice,
    sortField,
    sortOrder,
  ]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <main className="mt-5">
      <div className="container mx-auto">
        <FiterBar
          {...{
            sortField,
            setSortField,
            sortOrder,
            setSortOrder,
            searchQuery,
            setSearchQuery,
            minPrice,
            setMinPrice,
            maxPrice,
            setMaxPrice,
            clearFilterOptions,
          }}
        />
        <div className="flex">
          <div className="w-1/4 shadow bg-white rounded-md">
            {categories ? (
              <Categories
                {...{ categories, activeCategory, setActiveCategory }}
              />
            ) : (
              <>loading ....</>
            )}
          </div>
          <div className="w-3/4 flex flex-wrap">
            <HandelRemoteLayout>
              <HandelRemoteLayout.Pending isPending={laoding} />
              <HandelRemoteLayout.Rejected isRejected={error} />
              <HandelRemoteLayout.Empty
                isEmpty={!error && products?.length === 0}
              />
              <HandelRemoteLayout.Fullfilled
                isFullfilled={products && products?.length > 0}
              >
                <>
                  {products && (
                    <>
                      <Products {...{ products }} />
                      <Pagination
                        {...{
                          currentPage,
                          pages: pages.current,
                          nextPage,
                          prevPage,
                        }}
                      />
                    </>
                  )}
                </>
              </HandelRemoteLayout.Fullfilled>
            </HandelRemoteLayout>
          </div>
        </div>
      </div>
    </main>
  );
}
// pending
// success [empty, full]
// rejicted
const Categories = ({ setActiveCategory, activeCategory, categories }) => {
  return (
    <ul className="space-y-1">
      <li>
        <div
          onClick={() => setActiveCategory("all")}
          className={`block rounded-lg  px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-700 ${
            activeCategory === "all" && "bg-gray-100 text-gray-700"
          }`}
        >
          All
        </div>
      </li>
      {categories.map((category) => {
        return (
          <li key={category._id}>
            <div
              onClick={() => setActiveCategory(category._id)}
              className={`block rounded-lg  px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-700 ${
                activeCategory === category._id && "bg-gray-100 text-gray-700"
              }`}
            >
              {category.title}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const Products = ({ products }) => {
  return (
    <>
      {products.map((product) => (
        <div className="w-1/3 px-2" key={product._id}>
          <Link to="/" className="group relative block overflow-hidden">
            <button className="absolute end-4 top-4 z-10 rounded-full bg-white p-1.5 text-gray-900 transition hover:text-gray-900/75">
              <span className="sr-only">Wishlist</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>

            <img
              src={`${base_url_photo}${product.main_image}`}
              alt=""
              className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
            />

            <div className="relative border border-gray-100 bg-white p-6">
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {product.title}
              </h3>
              <p className="mt-1.5 text-sm text-gray-700">
                {product.description}
              </p>
              <p className="mt-1.5 text-sm text-gray-700">
                ${product?.price ? product.price : 145}
              </p>

              <form className="mt-4">
                <button className="block w-full rounded bg-yellow-400 p-4 text-sm font-medium transition hover:scale-105">
                  Add to Cart
                </button>
              </form>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

const Pagination = ({ currentPage, pages, nextPage, prevPage }) => {
  return (
    <div className="flex justify-center w-full">
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={prevPage}
          className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
        >
          <span className="sr-only">Prev Page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <p className="text-xs text-gray-900">
          {currentPage}
          <span className="mx-0.25">/</span>
          {pages}
        </p>

        <button
          onClick={nextPage}
          className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
        >
          <span className="sr-only">Next Page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const FiterBar = ({
  searchQuery,
  setSearchQuery,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  clearFilterOptions,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <Stack
      direction={"row"}
      gap={1}
      alignItems="center"
      className="rounded-md border border-gray-300 p-2 mb-5"
    >
      {/* search */}

      <Paper
        //class="open .MuiPaper-elevation"
        component="form"
        // style
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 200,
        }}
      >
        {/* ()=> <div><input */}
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search by title...."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Paper>
      {/* price */}
      <TextField
        label="Min Price"
        variant="outlined"
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        sx={{ minWidth: 120 }}
      />
      <TextField
        label="Maz Price"
        variant="outlined"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        sx={{ minWidth: 120 }}
      />
      {/* sort field select */}
      <FormControl>
        <InputLabel id="demo-simple-select-label">Sortt By</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sortField}
          label="Sort By"
          onChange={(e) => setSortField(e.target.value)}
        >
          <MenuItem value={"title"}>Title</MenuItem>
          <MenuItem value={"price"}>Price</MenuItem>
          <MenuItem value={"stock"}>Stock</MenuItem>
        </Select>
      </FormControl>
      <Button
        onClick={() =>
          setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        }
      >
        {sortOrder === "asc" ? " ASC" : "DESC"}{" "}
      </Button>
      <Button
        type="button"
        onClick={clearFilterOptions}
        variant="outlined"
        color="secondary"
      >
        Clear
      </Button>
      {/* sort order */}
    </Stack>
  );
};
