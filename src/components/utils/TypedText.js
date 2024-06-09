import { useEffect, useRef, useState } from "react";

export default function TypedText({ children, text, timeout=0, speed=100 })  {
    const elementRef = useRef(null);
    const [element, setElement] = useState(children(elementRef));
    useEffect(() => {
        var timeoutID;
        elementRef.current.innerHTML = "";
        var letter = 0;
        function wr() {
            if (letter >= text.length) {
                return;
            }
            elementRef.current.innerHTML += text.charAt(letter++);
            timeoutID = setTimeout(wr, Math.random() * speed);
        }
        timeoutID = setTimeout(wr, timeout);
        return () => clearTimeout(timeoutID);
    }, [text]);

    return element;
}