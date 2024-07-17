import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  Box,
} from "@mui/material";
import { Question } from "./types";
import { shuffleArray } from "./utils";
import { questions } from "./questions";

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [shuffledChoices, setShuffledChoices] = useState<[string, string][]>(
    []
  );
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setShuffledQuestions(shuffleArray(questions));
  }, []);

  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      setShuffledChoices(
        shuffleArray(
          Object.entries(shuffledQuestions[currentQuestionIndex].choices)
        )
      );
    }
  }, [currentQuestionIndex, shuffledQuestions]);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % shuffledQuestions.length);
    setSelectedAnswer("");
    setIsSubmitted(false);
  };

  if (shuffledQuestions.length === 0) {
    return <Typography>Loading...</Typography>;
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{ p: 3, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h5" gutterBottom>
          {currentQuestion.question}
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
          >
            {shuffledChoices.map(([key, value]) => (
              <FormControlLabel
                key={key}
                value={key}
                control={<Radio />}
                label={`${value}`}
                disabled={isSubmitted}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={isSubmitted ? handleNext : handleSubmit}
          disabled={!selectedAnswer && !isSubmitted}
          sx={{ mt: 2 }}
        >
          {isSubmitted ? "Next" : "Submit"}
        </Button>
        {isSubmitted && (
          <Typography sx={{ mt: 2 }}>
            {selectedAnswer === currentQuestion.correct_answer ? (
              "נכון!"
            ) : (
              <Box>
                <Typography>לא נכון. התשובה הנכונה היא: </Typography>
                <Typography>
                  {currentQuestion.choices[currentQuestion.correct_answer]}.
                </Typography>
              </Box>
            )}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default App;
