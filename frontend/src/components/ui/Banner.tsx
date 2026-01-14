
import { useNavigate } from "react-router-dom";
import { AppBar, Button, Container, Link, Toolbar, Typography, Modal, Box, IconButton } from "@mui/material";
import { FaGithub, FaLinkedin, FaTwitter, FaPhone, FaEnvelope, FaTimes } from "react-icons/fa";
import { useState } from "react";

function Banner() {
  const navigate = useNavigate();

  const handleHomeClick = () => navigate("/");
  //const handleLoginClick = () => navigate("/login/");
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  // Données des membres
  const teamMembers = [
    {
      name: "Nelson",
      role: "Lead Developer",
      email: "nelson@safetyhub.fr",
      phone: "+33 (0)6 12 34 56 78",
      socials: {
        github: "https://github.com/yimoun",
        linkedin: "https://linkedin.com/in/nelson",
        twitter: "https://twitter.com/nelson"
      },
      bio: "Développeur Full-Stack spécialisé en React et Django. Passionné par les solutions de sécurité innovantes.",
      skills: ["React", "Django", "TypeScript", "PostgreSQL"]
    },
    {
      name: "Jordan",
      role: "Product Designer & UX",
      email: "jordan@safetyhub.fr",
      phone: "+1 418 5505 5393",
      socials: {
        github: "https://github.com/Kampo237",
        linkedin: "https://linkedin.com/in/jordan",
        twitter: "https://twitter.com/jordan"
      },
      bio: "Développeur d'applications en fin de parcours au cegep de Chicoutimi . Créateur des interfaces modernes et intuitives.",
      skills: ["UI Design", "UX Research", "Material Design", "Django"]
    }
  ];


  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        backdropFilter: "blur(10px)"
      }}
    >
      <Container component="nav" disableGutters={true} maxWidth="xl">
        <Toolbar sx={{
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Link
            color="inherit"
            onClick={handleHomeClick}
            sx={{
              cursor: "pointer",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)"
              }
            }}
          >
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)"
            }}>
              🛡️
            </div>
            <div>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  letterSpacing: "-0.02em"
                }}
              >
                SafetyHub
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  opacity: 0.9,
                  lineHeight: 1,
                  fontWeight: 400
                }}
              >
                Hackathon 2025
              </Typography>
            </div>
          </Link>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "0.5rem",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.3)",
                animation: "pulse 2s infinite"
              }} />
              <span style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#ffffff"
              }}>
                Système opérationnel
              </span>
            </div>

            <Button
              variant="contained"
              onClick={() => setTeamModalOpen(true)}
              sx={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#ffffff",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: "0.5rem",
                textTransform: "none",
                fontSize: "0.875rem",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }
              }}
            >
              👤 Nelson & Jordan
            </Button>
              {teamModalOpen && (

                  <Modal
                    open={teamModalOpen}
                    onClose={() => setTeamModalOpen(false)}  // Ferme le modal
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                    <Box sx={{
                        width: { xs: "90%", sm: "95%", md: "900px" },
                        maxHeight: "85vh",
                        overflowY: "auto",
                        background: "#ffffff",
                        borderRadius: "1.5rem",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                        p: { xs: 3, md: 4 }
                      }}>
                        {/* Header modal */}
                        <Box sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 3,
                          pb: 2,
                          borderBottom: "2px solid #f3f4f6"
                        }}>
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1f2937", mb: 0.5 }}>
                              🎯 Notre Équipe
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6b7280" }}>
                              Découvrez les créateurs de SafetyHub
                            </Typography>
                          </Box>
                          <IconButton
                            onClick={() => setTeamModalOpen(false)}
                            sx={{
                              background: "#f3f4f6",
                              color: "#6b7280",
                              "&:hover": { background: "#e5e7eb" }
                            }}
                          >
                            <FaTimes />
                          </IconButton>
                        </Box>

                        {/* Grille équipe */}
                        <Box sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                          gap: 3
                        }}>
                      {teamMembers.map((member, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            p: 3,
                            borderRadius: "1rem",
                            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                            border: "1px solid rgba(102, 126, 234, 0.2)",
                            transition: "all 0.3s",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 10px 30px rgba(102, 126, 234, 0.15)"
                            }
                          }}
                        >
                      {/* Avatar et nom */}
                      <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2
                      }}>
                        <Box sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          fontSize: "1.5rem",
                          fontWeight: 700
                        }}>
                          {member.name[0]}
                        </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937", mb: 0.25 }}>
                {member.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#667eea", fontWeight: 600 }}>
                {member.role}
              </Typography>
            </Box>
          </Box>

          {/* Bio */}
          <Typography variant="body2" sx={{ color: "#374151", mb: 2, lineHeight: 1.6 }}>
            {member.bio}
          </Typography>

          {/* Skills */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 1 }}>
              Compétences
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {member.skills.map((skill, i) => (
                <Box
                  key={i}
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: "0.5rem",
                    background: "rgba(102, 126, 234, 0.15)",
                    color: "#667eea",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    border: "1px solid rgba(102, 126, 234, 0.3)"
                  }}
                >
                  {skill}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Contact */}
          <Box sx={{ mb: 2.5, pb: 2.5, borderBottom: "1px solid rgba(102, 126, 234, 0.2)" }}>
            <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 1 }}>
              Contact
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FaEnvelope style={{ fontSize: "0.9rem", color: "#667eea" }} />
                <Link
                  href={`mailto:${member.email}`}
                  sx={{
                    color: "#374151",
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    "&:hover": { color: "#667eea", textDecoration: "underline" }
                  }}
                >
                  {member.email}
                </Link>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FaPhone style={{ fontSize: "0.9rem", color: "#667eea" }} />
                <Link
                  href={`tel:${member.phone}`}
                  sx={{
                    color: "#374151",
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    "&:hover": { color: "#667eea", textDecoration: "underline" }
                  }}
                >
                  {member.phone}
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Réseaux sociaux */}
          <Box>
            <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 1 }}>
              Suivez-nous
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {member.socials.github && (
                <Link
                  href={member.socials.github}
                  target="_blank"
                  sx={{
                    color: "#667eea",
                    fontSize: "1.25rem",
                    transition: "all 0.2s",
                    "&:hover": { color: "#764ba2", transform: "scale(1.3)" }
                  }}
                >
                  <FaGithub />
                </Link>
              )}
              {member.socials.linkedin && (
                <Link
                  href={member.socials.linkedin}
                  target="_blank"
                  sx={{
                    color: "#667eea",
                    fontSize: "1.25rem",
                    transition: "all 0.2s",
                    "&:hover": { color: "#764ba2", transform: "scale(1.3)" }
                  }}
                >
                  <FaLinkedin />
                </Link>
              )}
              {member.socials.twitter && (
                <Link
                  href={member.socials.twitter}
                  target="_blank"
                  sx={{
                    color: "#667eea",
                    fontSize: "1.25rem",
                    transition: "all 0.2s",
                    "&:hover": { color: "#764ba2", transform: "scale(1.3)" }
                  }}
                >
                  <FaTwitter />
                </Link>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>

    {/* Info projet */}
    <Box sx={{
      mt: 4,
      p: 3,
      borderRadius: "1rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#ffffff"
    }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
        📁 À propos du projet
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 0.5 }}>
            Nom du projet
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            SafetyHub - SST v1.0
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 0.5 }}>
            Événement
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Hackathon 2025
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 0.5 }}>
            Date de création
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Novembre 2025
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 0.5 }}>
            Stack technologique
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            React • TypeScript • Django
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 0.5 }}>
            Base de données
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            PostgreSQL • MySQL
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 0.5 }}>
            Déploiement
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Docker • AWS
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
                  </Modal>
              )}

          </div>
        </Toolbar>
      </Container>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </AppBar>
  );
}

export default Banner;