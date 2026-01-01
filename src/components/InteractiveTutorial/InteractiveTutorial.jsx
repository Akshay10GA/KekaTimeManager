import React, { useState, useEffect } from "react";
import Joyride, { STATUS } from "react-joyride";

const InteractiveTutorial = ({
  showKekaCalculator,
  setShowKekaCalculator,
  showMenu,
  setShowMenu,
}) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem("tutorialCompleted");
    if (completed) {
      setRun(true);
    }
  }, []);

const steps = [
  {
    target: "body",
    content: (
      <div style={{ textAlign: "center", fontSize: "1.2rem" }}>
        There are changes to the app...<br />
        So… 🥁 drumrolls…<br />
        ...<br/>
        🆕 Surprise! Here's a guide we never provided before.
      </div>
    ),
    placement: "center",
    disableBeacon: true,
    index: 0,
  },
  {
    target: "body",
    content: "First things first! This is the canvas where your special backgrounds appear. 🎨",
    placement: "center",
    disableBeacon: true,
    index: 1,
  },
  {
    target: ".keka-manager",
    content: "Paste your time entries here to track your day. ⏰",
    placement: "top",
    disableBeacon: true,
    index: 2,
  },
  {
    target: ".joyride-calculate-button",
    content: "After pasting entries, hit this button to calculate your time. 🔢",
    placement: "top",
    disableBeacon: true,
    index: 3,
  },
  {
    target: ".joyride-blue-clock-position",
    content: "Check out your completed and remaining time here. Blue means progress! 💙",
    placement: "right",
    disableBeacon: true,
    index: 4,
  },
  {
    target: ".joyride-red-clock-position",
    content: "Break time details pop up here. Red means pause! 🛑",
    placement: "left",
    disableBeacon: true,
    index: 5,
  },
  {
    target: ".joyride-progress-bar",
    content: "Visualize your progress toward a 9-hour shift here. Watch it fill up! 📊",
    placement: "bottom",
    disableBeacon: true,
    index: 6
  },
  {
    target: ".hamburger-menu",
    content: "Click here to open the menu and access all the new features! (Or press 'Esc') 🍔",
    placement: "right",
    index: 7
  },
  {
    target: ".confession-mark",
    content: "Click here to share your thoughts anonymously with colleagues. It's fun and liberating! 🤫",
    placement: "right",
    index: 8
  },
  {
    target: ".movies-mark",
    content: "Click here to suggest movies and see what others recommend. Movie buffs unite! 🎬",
    placement: "right",
    index: 8
  },
  
  {
    target: ".quiz-mark",
    content: "Click here to take fun quizzes and challenge your knowledge. Test yourself! 🧠",
    placement: "right",
    index: 8
  },
  {
    target: "body",
    content: "🎉 That’s it! Have fun exploring all the new changes and don’t forget to give feedback.",
    placement: "center",
    disableBeacon: true,
  },
];


  const handleJoyrideCallback = (data) => {
    const { index, type, status } = data;

    if (index === 1 && type === "step:before") {
        setShowKekaCalculator(true)
    }

    // Open menu during step 3
    // if (index === 7 && type === "step:before") {
    //   setShowMenu(true);
    // }
    // Close menu after step 4 (Quiz step)
    // if (index === 8 && type === "step:after") {
    //   setShowMenu(false);
    // }

    // Step advancement
    if (type === "step:after" || type === "target:notFound") {
      setStepIndex(index + 1);
    }
    if (type === "step:before") {
      document.body.classList.add("joyride-block");
    }

    // Tutorial finished
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      document.body.classList.remove("joyride-block");
      localStorage.setItem("tutorialCompleted", "true");
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 2000,
          arrowColor: "#fff",
          backgroundColor: "#343434",
          textColor: "#fff",
          primaryColor: "#1976d2",
          width: "400px",
          whitespace: "no-wrap"
        },
      }}
    />
  );
};

export default InteractiveTutorial;
