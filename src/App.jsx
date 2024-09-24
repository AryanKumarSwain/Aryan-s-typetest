import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { BsArrowRepeat } from "react-icons/bs";
import { RiRestartLine } from "react-icons/ri";
import Typed from 'typed.js';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

const TypingTest = () => {
  const textSamples = [
    "swain is a passionate front-end developer with strong expertise in react.js and tailwind css. swain has a solid foundation in html, css, and javascript, bootstrap, and specializes in building dynamic and responsive user interfaces. additionally, swain is proficient in c, c++, and python, which complements swain's development skills. as a graphic designer, swain also brings experience in creating visually appealing designs. swain's goal is to integrate these skills to deliver exceptional user experiences and innovative web applications.",
    "swain enjoys playing various musical instruments, particularly the guitar and flute, which allow him to express his artistic side. music is a significant part of his life, offering a creative outlet and a way to connect with others. in addition to music, he finds joy in sketching and portrait art, capturing the essence of people and scenes around him. these artistic pursuits enrich his experiences and enhance his overall creativity, reflecting his passion for both sound and visual expression.",
    "swain is a skilled developer with a strong foundation in various programming languages and technologies. his expertise in react.js enables him to create dynamic web applications, while proficiency in c, c++, javascript, and python highlights his problem-solving abilities. swain is adept in web development, including html, css, and tailwind css, which allows him to design visually appealing interfaces. additionally, he has experience in video editing and graphic design. proficient in git and github, swain excels in collaborative environments, combining technical skills with leadership and teamwork to deliver exceptional user experiences."
  ];

  const getRandomText = () => {
    return textSamples[Math.floor(Math.random() * textSamples.length)];
  };

  const [text, setText] = useState(getRandomText());
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [errors, setErrors] = useState(0);
  const [selectedTime, setSelectedTime] = useState(60);
  const [customTime, setCustomTime] = useState('');
  const [isCustomTimeVisible, setIsCustomTimeVisible] = useState(false);

  const typedEl = useRef(null);

  useEffect(() => {
    // Initialize Typed.js effect only on the word "Swain_type"
    const typed = new Typed(typedEl.current, {
      strings: ['_type'],  // Only this word will animate
      loop: true,
      typeSpeed: 200,
      backSpeed: 100,
      backDelay: 2000,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  useEffect(() => {
    if (isTestRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isTestRunning) {
      showResults();
    }
  }, [timeLeft, isTestRunning]);

  const calculateWPM = () => {
    const wordsTyped = userInput.trim().split(" ").filter(word => word).length;
    const minutes = selectedTime / 60;
    const wpm = Math.round(wordsTyped / minutes);
    setWpm(wpm);
  };

  const showResults = () => {
    calculateWPM();
    Swal.fire({
      title: "Time's up!",
         icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Restart Test",
      cancelButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        restartTest();
      }
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    calculateErrors(value);

    if (!isTestRunning) {
      setIsTestRunning(true);
      setTimeLeft(selectedTime);
    }
  };

  const calculateErrors = (input) => {
    const textArray = text.split("");
    const inputArray = input.split("");
    let errorCount = 0;

    inputArray.forEach((char, idx) => {
      if (char !== textArray[idx]) {
        errorCount++;
      }
    });
    setErrors(errorCount);
  };

  const restartTest = () => {
    setUserInput("");
    setErrors(0);
    setWpm(0);
    setTimeLeft(selectedTime);
    setIsTestRunning(false);
  };

  const changeParagraph = () => {
    setText(getRandomText());
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setIsCustomTimeVisible(value === "custom");
    if (value === "custom") {
      const customValue = parseInt(customTime);
      if (customValue > 0) {
        setSelectedTime(customValue);
      } else {
        setSelectedTime(60);
      }
    } else {
      setSelectedTime(parseInt(value));
    }
  };

  const handleCustomTimeBlur = () => {
    const customValue = parseInt(customTime);
    if (customValue > 0) {
      setSelectedTime(customValue);
    } else {
      setSelectedTime(60);
    }
  };

  return (
   <div>
    <Navbar/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-5">
   
      {/* Typed.js animated text within a static sentence */}
      <h1 className="text-3xl font-bold mb-6 ">
        Swain
        <span className="text-blue-500" ref={typedEl}></span>
      </h1>

      <div className="flex items-center space-x-4">
        <div className="w-full max-w-5xl h-40 bg-gray-800 p-3 rounded overflow-y-auto border border-gray-700">
          <p className="uncopyable">{text}</p>
        </div>
        <button
          onClick={changeParagraph}
          className="mt-4 px-2 py-2 bg-blue-600 rounded-full">
          <BsArrowRepeat />
        </button>
      </div>

      <textarea
        className="w-full h-24 mt-4 p-4 bg-gray-800 text-white border border-gray-700 focus:outline-none"
        placeholder="Start typing here..."
        value={userInput}
        onChange={handleInputChange}
      />
      <div className="mt-4">
        <button
          onClick={restartTest}
          className=" px-4 py-2 bg-yellow-600 rounded">
          <RiRestartLine />
        </button>
        <label className="m-2">Select Time:</label>
        <select onChange={handleTimeChange} className="p-2 bg-gray-800 text-white border border-gray-700">
          <option value={60}>60 seconds</option>
          <option value={30}>30 seconds</option>
          <option value={120}>120 seconds</option>
          <option value="custom">Custom</option>
        </select>
        {isCustomTimeVisible && (
          <input
            type="number"
            placeholder="Custom time in seconds"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="ml-2 p-2 bg-gray-800 text-white border border-gray-700"
            onBlur={handleCustomTimeBlur}
          />
        )}
      </div>
      <div className="mt-4 flex space-x-4">
        <p>Time Left: {timeLeft}s</p>
        <p>WPM: {wpm}</p>
        <p>Errors: {errors}</p>
      </div>
      
    </div>
    <Footer/>
    </div>
  );
};

export default TypingTest;
