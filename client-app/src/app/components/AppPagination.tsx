import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";

interface Props {
  metaData: MetaData;
  onPageChange: (page: number) => void;
}

function AppPagination({
  metaData: { currentPage, pageSize, totalCount, totalPages },
  onPageChange,
}: Props) {
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
        page={currentPage}
        onChange={(e, page) => onPageChange(page)}
      />
    </Box>
  );
}
export default AppPagination;
