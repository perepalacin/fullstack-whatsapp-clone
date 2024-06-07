import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Slide, ToastContainer, toast } from 'react-toastify';
import {z} from "zod";

import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../../../context/AuthContext';


const formSchema = z.object({
    username: z.string().min(1, {message: "Username is required"}),
    password: z.string().min(1, {message: "Password is required"}),
});

type FormSchemaType = z.infer<typeof formSchema>;


const Login = () => {
  
  const {setAuthUser} = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const notify = (message: string) => toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Slide,
    });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema)
  })
  
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      });

      const userDetails = await res.json();
      if (userDetails.error) {
        throw new Error(userDetails.error);
      }

      localStorage.setItem("chatAppUserDetails", JSON.stringify(userDetails));
      setAuthUser(userDetails);

    } catch (error){
      if (error instanceof Error) {
        notify(error.message);
          }
    } finally {
      setIsSubmitting(false);
    }
}


  return (
    <main>
    <ToastContainer/>
    <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Log in</h1>
        <section>
            <label>
                    Username:
            </label>
            <input disabled={isSubmitting} placeholder='GiorgioBambino' {...register('username')}/>
            {errors.username?.message && <p>{errors.username?.message}</p>}
        </section>
        <section>
            <label>
                    password:
            </label>
            <input disabled={isSubmitting} type='password' {...register('password')}/>
            {errors.password?.message && <p>{errors.password?.message}</p>}
        </section>
        <button disabled={isSubmitting} type='submit'>Log in</button>
    </form>
    <p>You don't have an account?</p>
    <a href='/signup'>
        <button type='button'>
            Sign up
        </button>
    </a>
    </main>
  )
}

export default Login
