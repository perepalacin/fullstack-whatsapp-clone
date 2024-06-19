import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Slide, ToastContainer, toast } from 'react-toastify';
import {z} from "zod";

import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../../context/AuthContext';
import { ArrowRight, LoaderCircle } from 'lucide-react';


const formSchema = z.object({
    fullName: z.string().min(1, {message: "Your full name must have at least two characters"}),
    username: z.string().min(8, {message: "Your username should have at least 8 characters"}),
    password: z.string().min(8, {message: "Your password should have at least 8 characters"}),
    confirmPassword: z.string(),
    gender: z.string().min(1, {message: "Your gender is required"}),
})    .refine( ( { password, confirmPassword } ) => password === confirmPassword, {
  message: 'Passwords must match',
  path: [ 'confirmPassword' ],
} );

type FormSchemaType = z.infer<typeof formSchema>;


const SignUp = () => {
  
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

      const res = await fetch("/api/auth/signup", { 
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
    <main className='auth-screen'>
    <ToastContainer/>
    <form onSubmit={handleSubmit(onSubmit)}>
      <img src='/logo.png' width={200}/>
      <h1>Sign up for free now!</h1>
        <h2>Start chatting with your friends</h2>
        <section>
            <label>
                    Full name:
            </label>
            <input disabled={isSubmitting} placeholder='Giorgio Bambino' {...register('fullName')}/>
        </section>
            {errors.fullName?.message && <p className= "auth-error">{errors.fullName?.message}</p>}
        <section>
            <label>
                    Username:
            </label>
            <input disabled={isSubmitting} placeholder='GiorgioBambino' {...register('username')}/>
        </section>
            {errors.username?.message && <p className= "auth-error">{errors.username?.message}</p>}
        <section>
            <label>
                    Password:
            </label>
            <input disabled={isSubmitting} type='password' {...register('password')}/>
        </section>
            {errors.password?.message && <p className= "auth-error">{errors.password?.message}</p>}
        <section>
            <label>
                    Repeat password:
            </label>
            <input disabled={isSubmitting} type='password' {...register('confirmPassword')}/>
        </section>
            {errors.confirmPassword?.message && <p className= "auth-error">{errors.confirmPassword?.message}</p>}
        <select disabled={isSubmitting} {...register('gender')} className='gender-select'>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button disabled={isSubmitting} type='submit' className='auth-button'>
          <p>Sign up</p>
          {isSubmitting ? <LoaderCircle size={20} className='spin'/> : <ArrowRight size={20}/>}
        </button>
    </form>
    <div className='flex-row' style={{alignItems: 'center', gap: '0.5rem'}}>
      <p>Already have an account?</p>
      <a href='/login'>
        <button type='button' className='change-auth-page-button'>
          Log in
        </button>
      </a>
    </div>
    </main>
  )
}

export default SignUp
