import React, { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import {
  AiOutlineEllipsis,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlinePlus,
} from "react-icons/ai";
import { BsChatText, BsThreeDots } from "react-icons/bs";
import { AppTitle } from "../../components/AppTitle";
import { Dialog, Transition } from "@headlessui/react";
import galleryAdd from "../../assets/gallery-add.svg";
import { allLanguages } from "../../data/languages";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "../../components/Header/useSession";
import axios from "axios";
import { Button, Dropdown, Space } from "antd";
import iconTrash from "../../assets/Icontrash.svg";
import { getComents, postComent, getCommentCount } from "./authComments";
import { Link } from "react-router-dom";
import { clienteAxios } from "../../config/clienteAxios";
import { headers } from "../../helpers/headers";
headers



function timeAgoSincePublication(publicationDate) {
  const now = new Date();
  const publicationTime = new Date(publicationDate);

  const timeDifferenceInSeconds = Math.floor((now - publicationTime) / 1000);

  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} segundos`;
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} minutos`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours} horas`;
  } else {
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days} días`;
  }
}

const feedData = {
  id: 1,
  name: "esteban",
  time: "3 minutes ago",
  image: "/assets/person-post.png",
  avatar: "/assets/german.png",
  imagePost: "/assets/post1.png",
  likes: 1,
  comments: 13,
};


const PostCard = ({ keyProp, posts, setPosts }) => {
  const { usuario } = useSession();


  let [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenReport, setIsOpenReport] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [commentCount, setCommentCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [like, setLike] = useState(posts.numLikes);

  const [commentData, setCommentData] = useState([]);

  const [newComment, setNewComment] = useState("");
  
  const addComment = async () => {
    try {
      await postComent({
        datos: {
          comentario: newComment,
          id_publicacion: keyProp,
          id_cliente: usuario.id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerPosts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/feed");
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };


  const getComments = async () => {
    try {
      const { message } = await getComents(keyProp);
      return message;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getComments();
      setCommentData(data);
    })();
  }, []);

  const alreadyLike = async (data) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/feed/like/${usuario.id}/${posts.id}`
      );

      if (response.data.message === "Like") {
        setIsLiked(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const countComments = async () => {
    try {
      const response = await getCommentCount(keyProp);
      setCommentCount(response.commentCount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    countComments();
  }, []);

  const toggleLike = () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
  };

  const setLikes = async (data) => {
    try {
      if (isLiked) {
        const response = await axios.delete(
          `http://localhost:5000/feed/like/${usuario.id}/${posts.id}`
        );

        setIsLiked(false);
        setLike(like - 1);
        console.log(response);

        return;
      }

      const response = await axios.post("http://localhost:5000/feed/like", {
        id_cliente: usuario.id,
        id_publicacion: posts.id,
      });

      setIsLiked(true);
      setLike(like + 1);
      console.log(like);

      console.log(response);

      return;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    alreadyLike();
    // countLikes();
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModalDelete() {
    setIsOpenDelete(false);
  }

  function openModalDelete() {
    setIsOpenDelete(true);
  }

  function closeModalReport() {
    setIsOpenReport(false);
  }

  function openModalReport() {
    setIsOpenReport(true);
  }


  let matchingLanguage;

  allLanguages.forEach((language) => {
    if (posts.idioma === language[0]) {
      matchingLanguage = language;
    }
  });

  function timeAgoSincePublication(publicationDate) {
    const now = new Date();
    const publicationTime = new Date(publicationDate);

    const timeDifferenceInSeconds = Math.floor((now - publicationTime) / 1000);

    if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds} segundos`;
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutes} minutos`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hours} horas`;
    } else {
      const days = Math.floor(timeDifferenceInSeconds / 86400);
      return `${days} días`;
    }
  }

  const postDate = posts.fecha_creacion;
  const timeAgo = timeAgoSincePublication(postDate);

  //cosa del reporte xd
  const [reportDescription, setReportDescription] = useState("");
  const sendReport = async () => {
    try {
      await axios.post("http://localhost:5000/reports", {
        descripcion: reportDescription,
        id_cliente: usuario.id,
        id_publicacion: keyProp,
      });

      closeModalReport();
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
    }
  };
  const DeletePostModal = async () => {
    try {
      await clienteAxios.delete(`/delete-post/${keyProp}`, headers());
      // alert("Publicación eliminada exitosamente");
      obtenerPosts()
      closeModalDelete();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div key={keyProp} className="flex flex-col items-center mt-16">
      {/* Modal de eliminar post */}

      <Transition appear show={isOpenDelete} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10 h-screen"
          onClose={closeModalDelete}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 h-screen z-100" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    <div className="flex flex-col justify-center items-center gap-5 mb-10">
                      <img src={iconTrash} alt="" className="w-16" />
                      ¿Seguro que quieres eliminar tu publicación?
                    </div>
                  </Dialog.Title>
                  <div className="flex gap-5 justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#000000] px-4 py-2 text-sm font-medium text-white hover:bg-[#364C97] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModalDelete}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#ffdfe5b9] px-4 py-2 text-sm font-medium text-[#FF8399] hover:bg-[#ffdfe5f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={DeletePostModal}
                    >
                      Eliminar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal para el reporte */}
      <Transition appear show={isOpenReport} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 h-screen"
          onClose={closeModalReport}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 h-screen z-100" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-center mb-8"
                  >
                    Reportar publicación
                  </Dialog.Title>
                  <div className="w-full">
                    <textarea
                      onChange={(e) => setReportDescription(e.target.value)}
                      value={reportDescription}
                      placeholder="¿Por qué quieres reportar esta publicación?"
                      name=""
                      id=""
                      cols="30"
                      rows="6"
                      className="outline-none resize-none w-full"
                    ></textarea>

                    <div className="mt-4 flex justify-center gap-6">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-[#000000] px-7 py-2 text-sm font-medium text-white hover:bg-[#364C97] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModalReport}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-[#ffdfe5b9] px-4 py-2 text-sm font-medium text-[#FF8399] hover:bg-[#ffdfe5f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={sendReport}
                      >
                        Enviar reporte
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="border-l border-r border-t border-black bg-gray-100 flex flex-col p-4 w-[431px]">
        <div className="flex flex-row items-center justify-between w-full">
          <img
            className="w-12 h-12 -mr-3 z-[1] className="
            w-16
            h-16
            object-cover
            style={{
              clipPath: "circle(50% at 50% 50%)",
            }}
            src={`http://localhost:5000${posts.cliente.imagen_perfil}`}
            alt=""
          />
          {/* {console.log(posts.cliente.imagen_perfil)} */}
          <img className="w-12 h-12 " src={matchingLanguage[1]} alt="" />

          <div className="flex flex-col ml-6">
            <h6 className="font-bold">
              {posts.cliente.nombre} {posts.cliente.apellido}
            </h6>
            <h6 className="text-sm">Hace {timeAgo}</h6>
          </div>
          <Space direction="vertical" className="ml-auto">
            <Space wrap>
              <Dropdown
                menu={{
                  items:[
                    usuario.id == posts.cliente.id && {
                      key: "1",
                      label: <button onClick={openModalDelete}>Eliminar</button>,
                      danger: true,
                    },
                    {
                      key: "2",
                      label: <button onClick={openModalReport}>Reportar</button>,
                    },
                  ]
                }}
                placement="bottomLeft"
              >
                <BsThreeDots className="" size={25} />
              </Dropdown>
            </Space>
          </Space>
        </div>
        <div className="mt-4">
          <p>{posts.descripcion}</p>
        </div>
      </div>
      <img
        className="w-[431px] border-black border-[1px]"
        src={`http://localhost:5000/imagenes/processed-${posts.imagen}`}
        alt=""
      />
      <div className="border-l border-r border-b border-black bg-gray-100 flex flex-row items-center w-[431px] p-4">
        {isLiked ? (
          <AiFillHeart
            className="mr-2 w-6 h-6 cursor-pointer"
            style={{
              fill: "#FF0000",
              animation: "heartBeat 0.8s ease infinite",
              cursor: "pointer",
              opacity: 1,
            }}
            onClick={setLikes}
          />
        ) : (
          <AiOutlineHeart
            className="mr-2 w-6 h-6 cursor-pointer"
            onClick={setLikes}
          />
        )}
        <p>{like}</p>
        <div className="flex-grow"></div>
        <div onClick={openModal} className="cursor-pointer flex">
          <BsChatText className="mr-2 w-6 h-5" />
          <p className="text-sm">{commentCount} comentarios</p>
        </div>

        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10 h-screen"
            onClose={closeModal}
          >
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50 h-screen z-100" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="h-[95vh] transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
                    <div className="h-full flex">
                      <div className=" bg-black flex items-center justify-center">
                        <img
                          src={`http://localhost:5000/imagenes/processed-${posts.imagen}`}
                          alt=""
                          className="w-auto"
                        />
                      </div>
                      <div className="w-[25vw] h-full flex-col">
                        <div className=" border-b-[1px] p-5 flex items-center justify-between h-[10%]">
                          <div className="flex items-center gap-3">
                            <img
                              src={`http://localhost:5000${posts.cliente.imagen_perfil}`}
                              alt=""
                              className="w-10 "
                              object-cover
                              style={{
                                clipPath: "circle(50% at 50% 50%)",
                              }}
                            />
                            <p className="font-semibold">
                              {posts.cliente.nombre} {posts.cliente.apellido}
                            </p>
                          </div>
                          <div>
                            <Space direction="vertical">
                              <Space wrap>
                                <Dropdown
                                  menu={{
                                    items: [
                                      {
                                        label: <button onClick={openModalDelete}>Eliminar</button>,
                                        danger: true,
                                      },
                                      {
                                        key: "2",
                                        label: <button onClick={openModalReport}>Reportar</button>,
                                      },
                                    ]
                                  }}
                                  placement="bottomLeft"
                                >
                                  <BsThreeDots className="" size={25} />
                                </Dropdown>
                              </Space>
                            </Space>
                          </div>
                        </div>
                        <div className="flex flex-col h-[70%] items-start justify-start text-base p-5">
                          {commentData.length !== 0 ? (
                            commentData.map((comentario) => (
                              <div key={comentario.id} className="mb-2">
                                <p>
                                  {comentario.cliente.nombre}{" "}
                                  {comentario.cliente.apellido}:{" "}
                                  {comentario.descripcion}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p>Sin comentarios aún</p>
                          )}
                        </div>

                        <div className="h-[20%]">
                          <div className="p-5 border-t-[1px] flex items-center gap-3">
                            {isLiked ? (
                              <AiFillHeart
                                className="mr-2 w-8 h-8 cursor-pointer"
                                style={{
                                  fill: "#FF0000",
                                  animation: "heartBeat 0.8s ease infinite",
                                  cursor: "pointer",
                                  opacity: 1,
                                }}
                                onClick={setLikes}
                              />
                            ) : (
                              <AiOutlineHeart
                                className="mr-2 w-8 h-8 cursor-pointer"
                                onClick={setLikes}
                                w
                              />
                            )}
                            <div>
                              <p className="font-semibold">{like} likes</p>
                              <p className="text-[#9c9c9c] text-sm">
                                Hace {timeAgo}
                              </p>
                            </div>
                          </div>
                          <div className="p-5 border-t-[1px] flex justify-between gap-3 items-center">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              type="text"
                              className="outline-none w-full resize-none"
                              placeholder="Añade un comentario..."
                            />
                            <button
                              onClick={async () => {
                                await addComment({ comentario: newComment });
                                const data = await getComments();
                                setCommentData(data);
                                setNewComment("");
                              }}
                              className="text-[#ff8399] font-semibold cursor-pointer"
                            >
                              Publicar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

const PeopleSection = () => {
  const [usuarios, setUsuarios] = useState([]);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:5000/usuarios", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setUsuarios(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-pink-400 mt-14 ml-10">Personas</h1>
      {usuarios.map((usuario) => (
        <div className="flex flex-row mt-16 ml-8 items-center" key={usuario.id}>
          <img
            className="object-cover w-[6rem] h-[6rem]"
            style={{
              clipPath: "circle(50% at 50% 50%)",
            }}
            src={`http://localhost:5000${usuario.imagen_perfil}`}
            alt=""
          />
          <h3 className="p-6 font-bold text-lg">{`${usuario.nombre} ${usuario.apellido}`}</h3>
          <div className="ml-auto flex items-center">
            <Link to={"/profile/" + usuario.id} key={usuario.id}>
              <button className="shadow-circle border-2 border-black bg-white h-[45px] w-[100px] mr-8 hover:scale-105 hover: transition-scale ease-in duration-200">
                Ver perfil
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

const BlogSection = () => {
  const blogData = [
    {
      url: "/blog/article/info/card-1",
      title: "El políglota más famoso:",
      content:
        "Ziad Fazah es un libanés que ostenta el récord Guinness por hablar 59 idiomas. Su capacidad lingüística excepcional lo ha llevado a ser un maestro del lenguaje y a brindar conferencias sobre la importancia de la comunicación intercultural.",
      image: "/assets/p-card1.jpg",
    },
    {
      url: "/blog/article/info/card-2",
      title: "Palabras intraducibles:",
      content:
        "Algunos idiomas contienen términos que no pueden traducirse directamente a otros idiomas debido a su singularidad cultural. Por ejemplo, saudade en portugués describe una sensación de profunda nostalgia y añoranza.",
      image: "/assets/p-card2.jpg",
    },
    {
      url: "/blog/article/info/card-3",
      title: "El idioma más hablado:",
      content:
        "El chino mandarín es el idioma con más hablantes nativos en el mundo, superando los mil millones. Su compleja estructura y los tonos tonales hacen que sea un desafío intrigante para los estudiantes.",
      image: "/assets/p-card3.jpg",
    },
    {
      url: "/blog/article/info/card-4",
      title: "Orígenes del alfabeto:",
      content:
        "El alfabeto que usamos en gran parte del mundo, incluyendo inglés y muchos otros idiomas, tiene sus raíces en el antiguo Sinaí, donde las antiguas inscripciones hebreas evolucionaron con el tiempo para dar lugar a lo que hoy conocemos como el alfabeto.",
      image: "/assets/p-card4.jpg",
    },
    {
      url: "/blog/article/info/card-5",
      title: "Aprender mientras duermes:",
      content:
        "Aunque la idea de aprender mientras duermes ha sido objeto de debate, algunos estudios sugieren que la exposición a un idioma durante el sueño puede ayudar a familiarizarse con los sonidos, aunque no con el significado",
      image: "/assets/p-card5.jpg",
    },
  ];
  return (
    <div>
      <h1 className="text-4xl font-bold text-pink-400 mt-32 ml-10">
        Del <span className="text-indigo-600"> Blog</span>
      </h1>
      {blogData.map((card, index) => (
        <Link to={card.url} key={index}>
          <div className="flex flex-row mt-12 p-8">
            <img className="w-[170px] h-[120px]" src={card.image} alt="" />
            <div className="flex flex-col">
              <p className="font-bold text-xl ml-6">{card.title}</p>
              <p className="ml-6 mt-4">{card.content}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export function Feed() {
  const { usuario } = useSession();

  const [posts, setPosts] = useState(null);

  const [sentPost, setSentPost] = useState(null);

  const obtenerPosts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/feed");
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerPosts();
  }, [sentPost]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (selectedImage !== null && selectedLanguage !== null) {
      try {
        console.log(selectedImage2);
        console.log(selectedImage3);
        console.log(caption);
        const response = await axios.post(
          "http://localhost:5000/feed",
          {
            id_cliente: usuario.id,
            imagen: selectedImage3,
            idioma: selectedLanguage[0],
            descripcion: caption,
          },
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // console.log(response.data);

        setSentPost(data);

        setSelectedLanguage(null);
        setSelectedImage(null);
        setCaption("");
        closeModal();
      } catch (error) {
        console.error("Error", error);
      }
    }
  };

  let [isOpen, setIsOpen] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [selectedImage3, setSelectedImage3] = useState(null);

  const [caption, setCaption] = useState("");

  const handleLanguageClick = (language) => {
    setSelectedLanguage((prevLanguage) =>
      prevLanguage === language ? null : language
    );
    setValue("idioma", language[0]);
  };

  //no voy a mentir, esto de la imagen me lo hizo mi papi chat
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage3(event.target.files[0]);

      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);

      const reader2 = new FileReader();
      reader2.onload = (e) => {
        setSelectedImage2(e.target.result);
      };
      reader2.readAsArrayBuffer(file);
    }
  };

  const handleCaptionChange = (event) => {
    const value = event.target.value;
    if (value.length <= 200) {
      setCaption(value);
    }
  };

  function closeModal() {
    setIsOpen(false);
    setValue("descripcion", "");
  }

  function closeModal2() {
    setSelectedLanguage(null);
    setSelectedImage(null);
    setCaption("");
    setValue("idioma", selectedLanguage);
    setValue("descripcion", "");
    setValue("imagen", selectedImage);
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="grid grid-cols-[1fr_650px] lgv:grid-cols-1">
        <div className="mt-[40px] mx-[80px] h-full mb-10">
          <AppTitle title="Publicaciones" />
          <button
            onClick={openModal}
            className="flex items-center gap-3 px-5 mt-6 py-2.5 shadow-square border border-black bg-[#FFE9E9] hover:bg-[#FFD0D0] hover:transition-bg ease-in duration-200"
          >
            <AiOutlinePlus className="w-6 h-6" />
            <p>Crear una publicación</p>
          </button>
          <ToastContainer />
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10 h-screen"
              onClose={closeModal2}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25 h-screen z-100" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-[70vw] h-[80vh] transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        encType="multipart/form-data"
                      >
                        <Dialog.Title
                          as="div"
                          className="flex justify-between border-b-[1px] py-2 px-5"
                        >
                          <button
                            className="text-indigo-800 font-semibold"
                            onClick={closeModal2}
                          >
                            Cancelar
                          </button>
                          <h3 className="text-lg font-medium leading-6 text-gray-900 text-center ">
                            Crea nueva publicación
                          </h3>
                          <input
                            type="submit"
                            onClick={() => {
                              if (selectedImage === null) {
                                toast.error("Debes subir una imagen");
                              } else if (selectedLanguage === null) {
                                toast.error("Debes seleccionar el idioma");
                              } else {
                                closeModal();
                              }
                            }}
                            className="text-[#FF8399] font-semibold cursor-pointer"
                            value={"Compartir"}
                          ></input>
                        </Dialog.Title>

                        <div className="flex h-full">
                          {!selectedImage && (
                            <div className="w-[75%]  flex justify-center items-center border-r-[1px]">
                              <div className="flex flex-col gap-7">
                                <img
                                  src={galleryAdd}
                                  alt=""
                                  className="w-full h-full"
                                />
                                <label className="inline-flex justify-center rounded-md border border-transparent bg-[#ffdfe5b9] px-4 py-2 text-sm font-medium text-[#FF8399] hover:bg-[#ffdfe5f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer">
                                  Selecciona una imagen
                                  <input
                                    {...register("imagen")}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageSelect}
                                  />
                                </label>
                              </div>
                            </div>
                          )}

                          {selectedImage && (
                            <div className="w-[75%] flex justify-center items-center border-r-[1px]">
                              <img
                                src={selectedImage}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex flex-col w-[25%] h-full p-4 pr-5 gap-5">
                            <div className="flex gap-3 items-center">
                              <img
                                src={`http://localhost:5000${usuario.imagen_perfil}`}
                                alt=""
                                className="w-9 h-9 rounded-full object-cover"
                              />
                              <p className="font-semibold">
                                {usuario.nombre} {usuario.apellido}
                              </p>
                            </div>
                            <textarea
                              {...register("descripcion")}
                              className="outline-none resize-none"
                              id=""
                              cols="30"
                              rows="7"
                              placeholder="Escribe un pie de foto"
                              onChange={handleCaptionChange}
                            ></textarea>
                            <p className="text-sm text-end text-gray-500">
                              {caption.length}/200 caracteres
                            </p>
                            <div className="flex flex-col gap-4">
                              <p className="text-[#646464] text-[18px]">
                                Idioma
                              </p>

                              <div className="flex flex-col gap-1 overflow-y-scroll h-[260px]">
                                {allLanguages.map((language, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-4 items-center hover:bg-[#e4e4e4] rounded-lg p-2 cursor-pointer"
                                    onClick={() =>
                                      handleLanguageClick(language)
                                    }
                                  >
                                    <img
                                      src={language[1]}
                                      alt=""
                                      className="w-8"
                                    />
                                    <p>{language[0]}</p>
                                  </div>
                                ))}
                              </div>
                              {selectedLanguage && (
                                <div className="mt-4 flex max-w-[200px] mx-auto py-2 px-5 rounded-lg bg-[#f5f5f5] justify-center items-center gap-2">
                                  <img
                                    src={selectedLanguage[1]}
                                    alt=""
                                    className="w-8"
                                  />
                                  <p>{selectedLanguage[0]}</p>
                                  <input
                                    className="hidden"
                                    {...register("idioma")}
                                    type="text"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
          {posts &&
            posts.map((post) => (
              <PostCard keyProp={post.id} posts={post} key={post.id} setPosts={setPosts} />
            ))}
        </div>
        <div className="border-l border-solid border-black md:flex lgv:hidden sm:hidden">
          <PeopleSection />
          <BlogSection />
        </div>
      </div>
    </>
  );
}
