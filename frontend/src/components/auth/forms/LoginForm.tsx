
import React, { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Composants réutilisables
import FormTextField from "../../controls/FormTextField";
import ProgressBackdrop from "../../controls/ProgressBackdrop";
import { Button } from "../../ui/Button";

// Context
import useUser from "../../hooks/useUser";

// Styles
import {
  AuthContainer,
  AuthCard,
  AuthHeader,
  AuthBrandIcon,
  AuthTitle,
  AuthSubtitle,
  AuthForm,
  AuthFooter,
  AuthErrorMessage,
  ForgotPasswordLink,
} from "../../../styles/AuthStyles";
import UserDS from "../../../data_services/UserDS";
import type IUser from "../../../data_interfaces/IUser";

/**
 * Types pour le formulaire
 */
interface LoginFormData {
  username: string;
  password: string;
}

interface LocationState {
  from?: {
    pathname: string;
  };
}

interface LoginFormProps {
  /** Callback après connexion réussie */
  onSuccess?: () => void;
  /** Callback en cas d'erreur */
  onError?: (error: string) => void;
  /** URL de redirection par défaut après succès */
  redirectTo?: string;
  /** URL de redirection si onboarding non terminé */
  onboardingRedirect?: string;
  /** Titre personnalisé */
  title?: string;
  /** Sous-titre personnalisé */
  subtitle?: string;
  /** Icône du brand (emoji) */
  brandIcon?: string;
  /** Afficher le lien vers inscription */
  showSignupLink?: boolean;
  /** Afficher le lien mot de passe oublié */
  showForgotPassword?: boolean;
  /** Afficher le lien de retour */
  showBackLink?: boolean;
  /** Afficher les outils de debug */
  showDebug?: boolean;
}

/**
 * Formulaire de connexion avec outils de debug
 */
const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  redirectTo = "/app/chat",
  onboardingRedirect = "/onboarding",
  title = "Bon retour !",
  subtitle = "Connectez-vous pour continuer votre apprentissage",
  brandIcon = "🎓",
  showSignupLink = true,
  showForgotPassword = true,
  showBackLink = true,
  showDebug = true, // 🧪 Activer le debug par défaut
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginContext } = useUser();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  /**
   * Récupérer l'URL de redirection
   */
  const getRedirectUrl = (onboardingFinished: boolean): string => {
    if (!onboardingFinished) {
      return onboardingRedirect;
    }

    const state = location.state as LocationState;
    return state?.from?.pathname || redirectTo;
  };

  /**
   * 🧪 DEBUG: Afficher les utilisateurs de la BD locale
   */
  const handleShowUsers = () => {
    const usersDB = localStorage.getItem('aicodementor_users_db');
    const currentUser = localStorage.getItem('aicodementor_current_user');
    const token = localStorage.getItem('aicodementor_auth_token');

    const users: IUser[] = usersDB ? JSON.parse(usersDB) : [];

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🗄️ BASE DE DONNÉES LOCALE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📋 Utilisateurs enregistrés:', users.length);
    console.log('');
    
    users.forEach((user, index) => {
      console.log(`┌─ Utilisateur ${index + 1} ─────────────────────────────`);
      console.log(`│ ID:          ${user.id}`);
      console.log(`│ Username:    ${user.username}`);
      console.log(`│ Email:       ${user.email}`);
      console.log(`│ Password:    ${user.password}`);
      console.log(`│ Prénom:      ${user.first_name || '(non défini)'}`);
      console.log(`│ Nom:         ${user.last_name || '(non défini)'}`);
      console.log(`│ Email vérifié:      ${user.email_verified ? '✅' : '❌'}`);
      console.log(`│ Onboarding terminé: ${user.onboarding_finished ? '✅' : '❌'}`);
      console.log(`│ Plan:        ${user.plan}`);
      console.log(`│ Crédits:     ${user.credits}`);
      console.log(`└──────────────────────────────────────────────────`);
      console.log('');
    });

    console.log('🔐 Token actuel:', token ? '✅ Présent' : '❌ Absent');
    console.log('👤 User connecté:', currentUser ? JSON.parse(currentUser).username : 'Aucun');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Afficher aussi dans l'interface
    if (users.length === 0) {
      setDebugInfo('Aucun utilisateur enregistré. Créez un compte d\'abord !');
    } else {
      const info = users.map(u => 
        `📧 ${u.email || u.username} / 🔑 ${u.password}`
      ).join('\n');
      setDebugInfo(info);
    }
  };

  /**
   * 🧪 DEBUG: Remplir avec le premier utilisateur
   */
  const handleAutoFill = () => {
    const usersDB = localStorage.getItem('aicodementor_users_db');
    const users: IUser[] = usersDB ? JSON.parse(usersDB) : [];

    if (users.length > 0) {
      const firstUser = users[0];
      setValue('username', firstUser.email || firstUser.username || '');
      setValue('password', firstUser.password || '');
      setDebugInfo(`Rempli avec: ${firstUser.email || firstUser.username}`);
    } else {
      setDebugInfo('Aucun utilisateur à utiliser !');
    }
  };

  /**
   * 🧪 DEBUG: Créer un utilisateur de test
   */
  const handleCreateTestUser = async () => {
    try {
      const user = await UserDS.debugCreateTestUser();
      setDebugInfo(`Utilisateur de test créé !\n📧 test@example.com\n🔑 password123`);
      console.log('✅ Test user created:', user);
    } catch (error) {
      console.error('Error creating test user:', error);
    }
  };

  /**
   * 🧪 DEBUG: Vider la base de données
   */
  const handleClearDB = () => {
    UserDS.debugClearDB();
    setDebugInfo('Base de données vidée !');
  };

  /**
   * Soumission du formulaire
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Connexion via UserDS
      await UserDS.login(data.username, data.password);

      // 2. Récupérer les données utilisateur
      const userResponse = await UserDS.get();
      const user = userResponse.data;

      // 3. Mettre à jour le contexte utilisateur
      console.log("✅ Setting user context:", user);
      loginContext(user);

      // 4. Déterminer la redirection
      const onboardingFinished = user.onboarding_finished ?? false;
      const redirectUrl = getRedirectUrl(onboardingFinished);

      console.log("🔍 User onboarding_finished:", onboardingFinished);
      console.log("🧭 Redirecting to:", redirectUrl);

      // 5. Callback de succès
      if (onSuccess) {
        onSuccess();
      }

      // 6. Redirection
      navigate(redirectUrl, { replace: true });

    } catch (err: any) {
      console.error("Login error:", err);

      // Gestion des erreurs
      if (err.response?.status === 401) {
        setErrorMessage("Nom d'utilisateur ou mot de passe incorrect");
      } else if (err.response?.status === 403) {
        setErrorMessage("Votre compte n'est pas encore activé. Veuillez vérifier votre email.");
      } else {
        setErrorMessage(err.message || "Une erreur s'est produite. Veuillez réessayer.");
      }

      if (onError) {
        onError(err.message || "Une erreur s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        {/* Header */}
        <AuthHeader>
          <AuthBrandIcon>{brandIcon}</AuthBrandIcon>
          <AuthTitle>{title}</AuthTitle>
          <AuthSubtitle>{subtitle}</AuthSubtitle>
        </AuthHeader>

        {/* 🧪 Zone de Debug */}
        {showDebug && (
          <Box
            sx={{
              backgroundColor: '#E8F5E9',
              border: '1px solid #4CAF50',
              borderRadius: 1,
              padding: 2,
              marginBottom: 2,
            }}
          >
            <Box sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 'bold', 
              color: '#2E7D32',
              marginBottom: 1,
            }}>
              🧪 Outils de Debug (localStorage)
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: 1 }}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleShowUsers}
                style={{ fontSize: '0.75rem' }}
              >
                📋 Voir Users
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoFill}
                style={{ fontSize: '0.75rem' }}
              >
                ✏️ Auto-remplir
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCreateTestUser}
                style={{ fontSize: '0.75rem' }}
              >
                ➕ Créer Test User
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearDB}
                style={{ fontSize: '0.75rem', color: '#D32F2F' }}
              >
                🗑️ Vider BD
              </Button>
            </Box>

            {debugInfo && (
              <Box
                sx={{
                  backgroundColor: '#FFF',
                  padding: 1,
                  borderRadius: 0.5,
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  border: '1px dashed #ccc',
                }}
              >
                {debugInfo}
              </Box>
            )}
          </Box>
        )}

        {/* Message d'erreur */}
        {errorMessage && <AuthErrorMessage>{errorMessage}</AuthErrorMessage>}

        {/* Formulaire */}
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
          {/* Nom d'utilisateur */}
          <FormTextField
            label="Nom d'utilisateur ou email"
            type="text"
            placeholder="Entrez votre identifiant"
            autoComplete="username"
            autoFocus
            registerReturn={register("username", {
              required: "Le nom d'utilisateur est requis",
            })}
            errorText={errors.username?.message}
          />

          {/* Mot de passe */}
          <Box>
            <FormTextField
              label="Mot de passe"
              type="password"
              placeholder="Entrez votre mot de passe"
              autoComplete="current-password"
              registerReturn={register("password", {
                required: "Le mot de passe est requis",
              })}
              errorText={errors.password?.message}
            />

            {/* Lien mot de passe oublié */}
            {showForgotPassword && (
              <ForgotPasswordLink>
                <Link component={RouterLink} to="/forgot-password">
                  Mot de passe oublié ?
                </Link>
              </ForgotPasswordLink>
            )}
          </Box>

          {/* Bouton de connexion */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            style={{ marginTop: 16 }}
          >
            Se connecter
          </Button>
        </AuthForm>

        {/* Footer - Lien vers inscription */}
        {showSignupLink && (
          <AuthFooter>
            Pas encore de compte ?{" "}
            <Link component={RouterLink} to="/signup">
              Créer un compte
            </Link>
          </AuthFooter>
        )}
      </AuthCard>

      {/* Lien retour accueil */}
      {showBackLink && (
        <Link 
          component={RouterLink} 
          to="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            marginTop: 2,
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Retour à l'accueil
        </Link>
      )}

      {/* Backdrop de chargement */}
      <ProgressBackdrop open={isLoading} />
    </AuthContainer>
  );
};

export default LoginForm;