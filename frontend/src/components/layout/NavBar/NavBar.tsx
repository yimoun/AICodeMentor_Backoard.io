
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  NavbarContainer,
  NavbarToolbar,
  NavBrand,
  BrandIcon,
  BrandText,
  NavLinks,
  NavLink,
  NavCtaButton,
  MobileMenuButton,
} from "../../../styles/NavbarStyles";

interface NavLinkItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface NavbarProps {
  brandName?: string;
  brandIcon?: string;
  links?: NavLinkItem[];
  ctaText?: string;
  onCtaClick?: () => void;
  ctaHref?: string;
  onBrandClick?: () => void;
}

const defaultLinks: NavLinkItem[] = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Tarifs", href: "#pricing" },
  { label: "Connexion", href: "/login" },
];

const Navbar: React.FC<NavbarProps> = ({
  brandName = "AI Code Mentor",
  brandIcon = "🎓",
  links = defaultLinks,
  ctaText = "Commencer gratuitement",
  ctaHref = "/signup",
  onCtaClick,
  onBrandClick,
}) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleBrandClick = () => {
    if (onBrandClick) {
      onBrandClick();
    } else {
      navigate("/");
    }
  };

  const handleLinkClick = (link: NavLinkItem) => {
    if (link.onClick) {
      link.onClick();
    } else if (link.href) {
      if (link.href.startsWith("#")) {
        // Scroll to anchor
        const element = document.querySelector(link.href);
        element?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(link.href);
      }
    }
    setMobileOpen(false);
  };

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaHref) {
      navigate(ctaHref);
    }
    setMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <NavbarContainer position="sticky" color="default" elevation={1}>
        <NavbarToolbar disableGutters>
          <NavBrand onClick={handleBrandClick}>
            <BrandIcon>{brandIcon}</BrandIcon>
            <BrandText>{brandName}</BrandText>
          </NavBrand>

          <NavLinks>
            {links.map((link, index) => (
              <NavLink
                key={index}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link);
                }}
              >
                {link.label}
              </NavLink>
            ))}

            <NavCtaButton
              variant="contained"
              sx={{
                backgroundColor: "#ED1B2F",
                color: "#fff",
                border: "2px solid #ED1B2F",
                "&:hover": {
                  backgroundColor: "#C8102E",
                },
               borderRadius: "8px",
              }}
              size="small"
              onClick={handleCtaClick}
            >
              {ctaText}
            </NavCtaButton>
          </NavLinks>

          <MobileMenuButton>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenu}
              sx={{ color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>
          </MobileMenuButton>
        </NavbarToolbar>
      </NavbarContainer>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: 280,
            p: 2,
          },
        }}
      >
        <IconButton
          onClick={toggleMobileMenu}
          sx={{ alignSelf: "flex-end", mb: 2 }}
        >
          <CloseIcon />
        </IconButton>

        <List>
          {links.map((link, index) => (
            <ListItem
              key={index}
              onClick={() => handleLinkClick(link)}
              sx={{
                cursor: "pointer",
                borderRadius: 1,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          ))}
        </List>

        <NavCtaButton
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCtaClick}
          sx={{ mt: 2 }}
        >
          {ctaText}
        </NavCtaButton>
      </Drawer>
    </>
  );
};

export default Navbar;
