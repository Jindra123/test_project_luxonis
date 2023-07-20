import React, { useEffect, useState, FC } from 'react';
import ReactPaginate from 'react-paginate';
import axios from "axios";
import { motion } from "framer-motion";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface ItemsProps {
    currentItems: {
        title: string;
        image: string;
    }[];
}

const Items: FC<ItemsProps> = ({ currentItems }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {currentItems &&
        currentItems.map((item, id) => (
            <div key={id} className="max-w-sm border-b-2 border-b-purple rounded overflow-hidden shadow-lg duration-300 transition ease-in-out hover:scale-105 hover:border-b-4">
                <img className="w-full" src={item.image} alt={item.title}/>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">{item.title}</div>
                    </div>
            </div>
        ))}
    </div>
);

interface PaginatedItemsProps {
    itemsPerPage: number;
}

const PaginatedItems: FC<PaginatedItemsProps> = ({ itemsPerPage }) => {
    const paginationVariants = {
        hidden: {
            opacity: 0,
            y: 200,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 2,
            },
        },
    };

    const [items, setItems] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);

    const fetchItems = async () => {
        axios.get("http://localhost:3001/")
            .then((response) => {
                console.log(response.data[0].data);
                setItems(response.data[0].data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchItems();
    }, []);


    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handlePageClick = (event: { selected: number }) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    const showNextButton = itemOffset !== items.length - 1;
    const showPrevButton = itemOffset !== 0;

    return (
        <>
            <Items currentItems={currentItems} />
            <motion.div
                variants={paginationVariants}
                initial="hidden"
                animate="visible"
            >
                <ReactPaginate
                    breakLabel={<span className="mr-4">...</span>}
                    nextLabel={
                        showNextButton ? (
                            <span className="w-10 h-10 flex items-center justify-center bg-lightGray rounded-md">
                              <BsChevronRight />
                            </span>
                        ) : null
                    }
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    pageCount={pageCount}
                    previousLabel={
                        showPrevButton ? (
                            <span className="w-10 h-10 flex items-center justify-center bg-lightGray rounded-md mr-4">
                              <BsChevronLeft />
                            </span>
                        ) : null
                    }
                    containerClassName="flex items-center justify-center mt-8 mb-4"
                    pageClassName="block border- border-solid border-lightGray hover:bg-lightGray w-10 h-10 flex items-center justify-center rounded-md mr-4"
                    activeClassName="bg-purple text-white"
                    marginPagesDisplayed={1}
                />
            </motion.div>
        </>
    );
};

export default PaginatedItems;