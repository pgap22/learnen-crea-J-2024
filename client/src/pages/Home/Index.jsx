import {React, useState} from "react";

export function IndexCard() {

  const cardsData = [
    {
      imgSrc: "/assets/Male.png",
      description: "Rob: Habla inglés pero quiere practicar su alemán",
    },
    {
      imgSrc: "/assets/Male(1).png",
      description: "Rob: Habla inglés pero quiere practicar su alemán",
    },
    {
      imgSrc: "/assets/Male(2).png",
      description: "Rob: Habla inglés pero quiere practicar su alemán",
    },
    {
      imgSrc: "/assets/Female.png",
      description: "Rob: Habla inglés pero quiere practicar su alemán",
    },
    {
      imgSrc: "/assets/Female(1).png",
      description: "Rob: Habla inglés pero quiere practicar su alemán",
    },
    {
      imgSrc: "/assets/Female(2).png",
      description: "Rob: Habla inglés pero quiere practicar su alemán",
    },
  ];
  return (
    <>
      {/* Introducción al index */}
      <div className="flex flex-col items-center">
        <img className="w-44 mt-24" src="../assets/learnen.svg" alt="" />
        <p className="p-6 text-xl	">
          Un sitio donde puedes aprender cualquier idioma con la comunidad
        </p>
      </div>

      {/* Cards de presentación */}
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-3 pt-6 px-32 gap-6 max-w-7xl">
          {cardsData.map((card, index) => (
            <div key={index}>
              <div className="relative">
                <img src={card.imgSrc} alt="" className="" />
                <p className="absolute bottom-4 left-0 m-2 text-white text-xl">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón */}
      <div className="flex items-center justify-center">
        <button className="flex items-center justify-center shadow-circle border-2 border-black bg-gray-300 gap-6 h-8 py-7 px-12 mt-10 mb-14 text-xl">
          Únete a la comunidad
        </button>
      </div>
    </>
  );
}

export function IndexSteps() {
  const dataCards = [
    {
      img: "/assets/paso1.png",
      h1: "1. Únete a la comunidad",
      p: (
        <p className="text-2xl">
          Crea una cuenta e inicia <br /> sesión, así podrás <br /> acceder a
          todas nuestras <br />
          funcionalidades.
        </p>
      ),
      props: "",
    },
    {
      img: "/assets/paso2.png",
      h1: "2. Encuentra amigos",
      p: (
        <p className="text-2xl">
          Puedes encontrar <br /> personas fácilmente que <br /> practican tu
          idioma <br /> y comparten tus interéses.
        </p>
      ),
      props: "",
    },
    {
      img: "/assets/paso3.png",
      h1: "3. ¡Interactúa!",
      p: (
        <p className="text-2xl">
          Puedes compartir <br /> publicaciones con la <br /> comunidad y
          chatear con <br /> personas.
        </p>
      ),
      props: "",
    },
  ];

  return (
    <>
      <hr />
      <div className="flex flex-row justify-center mt-10 text-[1.8rem] font-extrabold">
        <p>
          ¿Cómo funciona?<span className="text-indigo-600"> Learnen</span>
        </p>
      </div>

      {/* Pasos de cómo funciona */}
      <div className="flex flex-col mt-32">
        <div className="grid grid-cols-1 gap-x-32 ">
          {dataCards.map((card, index) => (
            <div key={index} className="flex flex-col mb-8">
              <div className="flex flex-row  justify-center gap-x-40 gap-y-36">
                <div className="flex flex-col">
                  <h1 className="mb-4 font-bold text-[1.5rem]">{card.h1}</h1>
                  {card.p}
                </div>
                <img className="w-1/4" src={card.img} alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function IndexBlog() {
  const dataCards = [
    {
      language: "ESPAÑOL",
      title: "Simple juice recipes to boost your immune system",
      p: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto tempora id cumque! Ut, doloremque consectetur quidem perferendis tenetur ipsum facilis aspernatur odit nulla iusto in ex quas, quae ",
      img: "/assets/blog-image.png",
    },
    {
      language: "ESPAÑOL",
      title: "Simple juice recipes to boost your immune system",
      p: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto tempora id cumque! Ut, doloremque consectetur quidem perferendis tenetur ipsum facilis aspernatur odit nulla iusto in ex quas, quae ",
      img: "/assets/blog-image.png",
    },
    {
      language: "ESPAÑOL",
      title: "Simple juice recipes to boost your immune system",
      p: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto tempora id cumque! Ut, doloremque consectetur quidem perferendis tenetur ipsum facilis aspernatur odit nulla iusto in ex quas, quae ",
      img: "/assets/blog-image.png",
    },
  ];

  return (
    <>
      <div className="bg-gray-100">
        <p className="font-bold text-4xl pl-32 pt-24">De nuestro blog</p>
        <div className="flex flex-row gap-10 justify-center mt-20">
          {dataCards.map((card, index) => (
            <div key={index} className="mb-8 w-96">
              <div className="">
                <img src={card.img} className='w-full' alt="" />
              </div>
              <div className="bg-white p-10">
                <h6 className="text-blue-400 text-sm">{card.language}</h6>
                <h2 className="mt-4 font-bold text-[1.3rem]">{card.title}</h2>
                <h4 className="mt-4 text-base">{card.p}</h4>
                <hr className='mt-12' />
                <p className="text-sm flex justify-end">2 días</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/assets/slider1.png",
      quote: "Desde que uso Learnen mi nivel de Inglés se ha visto mejorado de manera exponencialmente",
      author: "Nacely Orellana"
    },
    {
      id: 2,
      image: "/assets/slider1.png",
      quote: "Desde que uso Learnen mi nivel de Inglés se ha visto mejorado de manera exponencialmente",
      author: "Nacely "
    },
    // Agrega aquí los otros elementos del slider
  ];

  const handleSlideChange = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="flex justify-center pb-32">
      <div className="max-w-screen-lg">
        <div className="flex items-center bg-gray-100 mt-20 transform rotate-[2deg]">
          <div className="w-40 h-40">
            <div className="bg-gray-100 p-4 transform -skew-x-6">
              <img
                className="rounded-full w-full h-full object-cover"
                src={slides[activeIndex].image}
                alt="Imagen"
              />
            </div>
          </div>
          <div className="w-1/2 flex-shrink-0">
            <div className="p-4">
              <p className="font-bold text-xl mt-4">{slides[activeIndex].quote}</p>
              <p className="text-lg mt-10">{slides[activeIndex].author}</p>
            </div>
            <div className="flex justify-center space-x-2 mt-4 pb-8">
              {slides.map((slide, index) => (
                <span
                  key={slide.id}
                  className={`w-3 h-3 rounded-full bg-gray-500 ${activeIndex === index && 'bg-blue-500'}`}
                  onClick={() => handleSlideChange(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Home() {
  return (
    <>
      <IndexCard />
      <IndexSteps />
      <IndexBlog />
      <Slider/>
    </>
  );
}
