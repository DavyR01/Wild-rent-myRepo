import { useLazyQuery } from "@apollo/client";
import ErrorsValidations from "components/ui/ErrorsValidations";
import { toastSuccessRegister } from "components/ui/Toast";
import { UserContext } from "contexts/UserContext";
import { LOGIN } from "lib/graphql/queries";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiEye, HiEyeOff } from "react-icons/hi";
import "react-toastify/dist/ReactToastify.css";
import { inputLoginUser } from "types/inputLoginUser";
import { validateEmail } from "validators/authUser.validator-front";

const LoginPage = () => {
   const authInfo = useContext(UserContext);
   const userRole = authInfo.role;
   const isLoggedIn = authInfo.isLoggedIn;
   const userEmail = authInfo.email;

   console.log("User Role : ", userRole);
   console.log("is Logged In : ", isLoggedIn);
   console.log("User Email : ", userEmail);

   // Affiche la pop up d'enregistrement avec succès
   useEffect(() => {
      const registrationSuccess = localStorage.getItem("registrationSuccess");
      if (registrationSuccess) {
         toastSuccessRegister();
         localStorage.removeItem("registrationSuccess");
      }
   }, []);

   const router = useRouter();
   const [errorMessage, setErrorMessage] = useState("");

   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
   };
   const [showPassword, setShowPassword] = useState(false);
   const eyeIcon = showPassword ? <HiEyeOff /> : <HiEye />;

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<inputLoginUser>();

   const [handleLogin] = useLazyQuery(LOGIN, {
      async onCompleted(data) {
         localStorage.setItem("jwt", data.loginUser);
         authInfo.refetchLogin();

      },
      onError(err) {
         if (err.message.includes("User not found")) {
            setErrorMessage("Aucun compte n'a été trouvé pour cette adresse mail.");
         } else if (err.message.includes("Invalid password")) {
            setErrorMessage("Mot de passe incorrect.");
         } else {
            setErrorMessage(
               "Une erreur s'est produite lors de l'authentification.",
            );
         }
      },
   });

   // on Submit
   const onSubmit: SubmitHandler<inputLoginUser> = async (formData) => {
      setErrorMessage("");
      try {
         await handleLogin({
            variables: {
               inputUserLogin: {
                  email: formData.email,
                  password: formData.password,
               },
            },
         });
      } catch (err) {
         setErrorMessage("Une erreur s'est produite lors de l'authentification.");
      }
   };

   if (isLoggedIn) {
      router.push("/");
   }

   // Styles
   const passwordInputClass = `focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border ${errorMessage === "Mot de passe incorrect." ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
      } bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`;

   const emailInputClass = `focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border ${errorMessage === "Aucun compte n'a été trouvé pour cette adresse mail." ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
      } bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`;



   return (
      <main>
         <div className="flex justify-center">
            <div className="w-full rounded-lg bg-white shadow md:max-w-lg xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
               <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                  <div className="mb-6 flex items-center">
                     <Link
                        href="./"
                        className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
                     >
                        <Image
                           src="/wildrent-logo.png"
                           alt="test"
                           width={50}
                           height={50}
                        />
                     </Link>
                     <h1 className="ml-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Se connecter à votre compte
                     </h1>
                  </div>


                  <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>

                     {/* E-mail */}
                     <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                           E-mail
                        </label>
                        <input
                           type="email"
                           {...register("email", {
                              validate: validateEmail
                           })}
                           className={`
                              ${emailInputClass}                              
                              ${errors.email ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                                 : 'border-gray-300 focus:ring-primary-600 focus:border-black dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
                           placeholder="name@domain.com"
                        />

                        {/* Gestion des erreurs e-mails */}
                        {errors.email && <ErrorsValidations message={errors.email.message} />}
                     </div>

                     {/* Mot de passe */}
                     <div>
                        <div className="flex flex-row relative" >
                           <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                              Mot de passe
                           </label>
                        </div>
                        <div className="relative">
                           <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              {...register("password", {
                                 required: "Le mot de passe est requis",
                              })}
                              placeholder="••••••••"
                              className={`${passwordInputClass} 
                                 ${errors.password ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-primary-600 focus:border-black dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
                           />
                           <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                              onClick={togglePasswordVisibility}
                           >
                              {eyeIcon}
                           </button>

                           {/* Gestion des erreurs mot de passe */}
                        </div>
                        {errors.password && <ErrorsValidations message={errors.password.message} />}
                     </div>


                     <div className="flex flex-wrap items-center justify-between">
                        <div className="flex items-start">
                           <div className="flex h-5 items-center">
                              <input
                                 id="remember"
                                 aria-describedby="remember"
                                 type="checkbox"
                                 className="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 cursor-pointer rounded border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                              />
                           </div>
                           <div className="ml-3 text-sm">
                              <label className="text-gray-500 dark:text-gray-300">
                                 Se souvenir de moi
                              </label>
                           </div>
                        </div>
                     </div>

                     {/* Bouton Se Connecter */}
                     <button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                     >
                        Se connecter
                     </button>
                     <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Vous n&apos;avez pas encore de compte ?{" "}
                        <Link
                           href="/register"
                           className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                        >
                           S&apos;enregistrer
                        </Link>
                     </p>
                  </form>

                  {/* Gestion des erreurs globales */}
                  {errorMessage && <ErrorsValidations message={errorMessage} />}
               </div>
            </div>
         </div>
      </main>
   );
};

export default LoginPage;
