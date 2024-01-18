import React from 'react';
import { Box, Button } from '@chakra-ui/react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    console.log('Total Pages:', totalPages);
    console.log('currentPage:', currentPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={currentPage === i ? 'solid' : 'outline'}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }
    console.log('pageNumbers:', pageNumbers);
    return pageNumbers;
  };

  console.log('Rendering Pagination');
  return (
    <Box mt={4} textAlign="center">
      {renderPageNumbers()}
    </Box>
  );
};

export default Pagination;
