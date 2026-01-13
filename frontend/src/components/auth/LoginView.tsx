import { useState } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";  
import { yupResolver } from "@hookform/resolvers/yup";  
import * as yup from "yup"; 
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FormTextField from "../controls/FormTextField";
import ProgressBackdrop from "../controls/ProgressBackdrop";
import UserDS from "../../data_services/UserDS";



type FormLoginFields = {
  username: string;
  password: string;
};

function LoginView() {
  const navigate: NavigateFunction = useNavigate();

  const [showPassword, setShowPassword] = useState(false);  
  const [submitWarning, setSubmitWarning] = useState("");  
  const [submitError, setSubmitError] = useState("");       
  const [submitting, setSubmitting] = useState(false);      



  
  const formSchema = yup.object().shape({
    username: yup.string().required("Le nom d'utilisateur est obligatoire"),
    password: yup.string().required("Le mot de passe est obligatoire"),
  });

  
  //Initialisation du formulaire
  const {
    formState: { errors },  
    handleSubmit, 
    register, 
  } = useForm<FormLoginFields>({
    resolver: yupResolver(formSchema),
  });

  //Fonction pour afficher/masquer le mot de passe
  const handleShowPasswordClick = (): void => {
    setShowPassword((prev) => !prev);
  };

 
  const handleFormSubmit = (data: FormLoginFields): void => {
    navigate("/events"); //TODO: Ajout temporaire pour bypasser la vérification du recaptcha pendant le développement
    //Réinitialisation des messages d'erreur
    setSubmitWarning("");
    setSubmitError("");
    setSubmitting(true);


     navigate("/events"); //TODO: Ajout temporaire pour bypasser la vérification du recaptcha pendant le développement

    UserDS.login(data.username, data.password)
      .then(() => {
        navigate("/"); //En cas de succes l’utilisateur est redirigé vers la route de path /.
      })
      .catch((err) => {
        if (
          err.response.status === 401 &&
          err.response.data === "no_active_account"
        ) {
          setSubmitWarning("Aucun compte actif n'a été trouvé.");
        } else {
          setSubmitError(
            "Une erreur s'est produite lors de la connexion, veuillez réessayer."
          );
        }
      })
      .finally(() => {
        setSubmitting(false); 
      });
  };

  
  const handleSignUpClick = () => {
    navigate("/signup/");
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        S'identifier
      </Typography>
     
      <Box 
        component="form"
        noValidate
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ mt: 1, width: "100%" }}
      >
        <FormTextField
          autoComplete="username"
          autoFocus
          errorText={errors.username?.message}  
          label="Nom d'utilisateur"
          registerReturn={register("username")}
        />
        <FormTextField
          autoComplete="current-password"
          errorText={errors.password?.message}  
          label="Mot de passe"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    aria-label="toggle password visibility"
                    onClick={() => handleShowPasswordClick()}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          registerReturn={register("password")}
          type={showPassword ? "text" : "password"}
        />


        {submitWarning !== "" && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {submitWarning}
          </Alert>
        )}
        {submitError !== "" && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {submitError}
          </Alert>
        )}


        <Button
          color="primary"
          fullWidth
          sx={{ mb: 2, mt: 3 }}
          type="submit"
          variant="contained"
        >
          Se connecter
        </Button>
        <Link
          component="div"
          onClick={handleSignUpClick}
          sx={{ cursor: "pointer" }}
          textAlign="right"
          variant="body2"
        >
          Vous n'avez pas de compte? S'inscrire
        </Link>
      </Box>
      <ProgressBackdrop open={submitting} />
    </>
  );
}

export default LoginView;
