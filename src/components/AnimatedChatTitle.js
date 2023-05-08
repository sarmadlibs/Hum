import React, { useEffect, useRef } from "react";
import anime from "animejs";

const AnimatedChatTitle = ({ text }) => {
  const chatTitleRef = useRef(null);

  useEffect(() => {
    const chars = text.split("");
    const $text = chatTitleRef.current;
    $text.innerHTML = chars.map((c, i) => `<span>${c}</span>`).join("");

    anime({
      targets: $text.querySelectorAll("span"),
      color: [{ value: "#FFFFFF" }, { value: "#D7BE69" }, { value: "#0D5BE1" }],
      duration: 2000,
      delay: anime.stagger(150),
      loop: true,
      easing: "linear",
      direction: "alternate",
    });

    return () => {
      anime.remove($text.querySelectorAll("span"));
    };
  }, [text]);

  return <h2 className="chat-title" ref={chatTitleRef}></h2>;
};

export default AnimatedChatTitle;
