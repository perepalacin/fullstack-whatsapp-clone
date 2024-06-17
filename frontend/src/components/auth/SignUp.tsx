import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Slide, ToastContainer, toast } from 'react-toastify';
import {z} from "zod";

import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../../context/AuthContext';


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
    <main>
    <ToastContainer/>
    <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign up</h1>
        <section>
            <label>
                    Full name:
            </label>
            <input disabled={isSubmitting} placeholder='Giorgio Bambino' {...register('fullName')}/>
            {errors.fullName?.message && <p>{errors.fullName?.message}</p>}
        </section>
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
        <section>
            <label>
                    Repeat password:
            </label>
            <input disabled={isSubmitting} type='password' {...register('confirmPassword')}/>
            {errors.confirmPassword?.message && <p>{errors.confirmPassword?.message}</p>}
        </section>
        <select disabled={isSubmitting} {...register('gender')}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button disabled={isSubmitting} type='submit'>Sign up</button>
    </form>
    <p>Already have an account?</p>
    <a href='/login'>
      <button type='button'>
        Log in
      </button>
    </a>
    </main>
  )
}

export default SignUp
