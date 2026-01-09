import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";


export const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  padding: theme.spacing(4, "50%"),

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 2),
  },
  width: "100%",
}));


export const FooterContent = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  margin: "0 auto",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(2),
    textAlign: "center",
  },
}));


export const FooterBrand = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));


export const BrandIcon = styled("span")({
  fontSize: "1.5rem",
  lineHeight: 1,
});


export const BrandName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1rem",
  color: theme.palette.common.white,
}));


export const CopyrightText = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.grey[400],
}));
