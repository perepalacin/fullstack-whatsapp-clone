import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer } from 'react-toastify';
import {z} from "zod";

import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../../context/AuthContext';
import { notifyError } from '../Toasts';
import { ArrowRight, LoaderCircle } from 'lucide-react';


const formSchema = z.object({
    username: z.string().min(1, {message: "Username is required"}),
    password: z.string().min(1, {message: "Password is required"}),
});

type FormSchemaType = z.infer<typeof formSchema>;


const Login = () => {
  
  const {setAuthUser} = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        notifyError(error.message);
          }
    } finally {
      setIsSubmitting(false);
    }
}


  return (
    <main className='auth-screen'>
    <ToastContainer/>
    <form onSubmit={handleSubmit(onSubmit)}>
        <img src='/logo.png' width={200}/>
        <h1>Welcome back!</h1>
        <h2>Please log into your account</h2>
        <section>
            <label>
                    Username:
            </label>
            <input disabled={isSubmitting} placeholder='GiorgioBambino' {...register('username')}/>
        </section>
            {errors.username?.message && <p className='auth-error'>{errors.username?.message}</p>}
        <section>
            <label>
                    password:
            </label>
            <input disabled={isSubmitting} type='password' {...register('password')}/>
        </section>
            {errors.password?.message && <p className='auth-error'>{errors.password?.message}</p>}
        <button disabled={isSubmitting} type='submit' className='auth-button'>
          <p>Log in</p>
          {isSubmitting ? <LoaderCircle size={20} className='spin'/> : <ArrowRight size={20} />}
        </button>
    </form>
    <div className='flex-row' style={{alignItems: 'center', gap: '0.5rem'}}>
    <p>You don't have an account?</p>
    <a href='/signup'>
        <button type='button'className='change-auth-page-button'>
            Sign up
        </button>
    </a>
    </div>
    </main>
  )
}

export default Login
