import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";
import { useState } from "react";

interface Props {
  metaData: MetaData;
  onPageChange: (page: number) => void;
}

function AppPagination({
  metaData: { currentPage, pageSize, totalCount, totalPages },
  onPageChange,
}: Props) {
  const [pageNumber, setPageNumber] = useState(currentPage);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    onPageChange(page);
  };

  return (
    <Box
      sx={{
        mx: "auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Typography>
        Showing {pageSize * (currentPage - 1) + 1} to {pageSize * currentPage}{" "}
        of {totalCount} results
      </Typography>
      <Pagination
        color="primary"
        count={totalPages}
        page={pageNumber}
        onChange={(e, page) => handlePageChange(page)}
      />
    </Box>
  );
}
export default AppPagination;
