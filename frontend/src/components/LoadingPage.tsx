import { LoaderCircle } from "lucide-react"

const LoadingPage = () => {
  return (
    <section className='w-full h-full flex-col' style={{alignItems: 'center', justifyContent: 'center', zIndex: '100', position: 'absolute', top: 0, left: 0, backgroundColor: '#222E35', gap: '2rem'}}>
        <img src= "/logo.png" width={200}/>
        <p>Welcome to this Whatsapp clone made by Pere Palacín</p>
        <p>Please wait until your content is loaded</p>
        <LoaderCircle size={32} className="spin"/>
    </section>
  )
}

export default LoadingPage