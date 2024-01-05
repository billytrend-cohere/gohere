import * as express from 'express'
import { CohereClient } from "cohere-ai";
import { ChatCompletion } from 'openai/resources';
const app = express()
const port = 8080
app.use(express.json())

app.post('/openai/v1/chat/completions', async (req, res) => {
    const cohere = new CohereClient({
        token: req.headers.authorization.split(" ")[1],
    });

    const [message, ...chatHistory] = req.body.messages.map(({role, content}) => ({ role, message: content }))

    const response = await cohere.chat({
        message: message.message,
        chatHistory
    });

    const openaiResponse: ChatCompletion = {
        id: response.generationId,
        object: 'chat.completion',
        created: Date.now(),
        model: req.body.model,
        choices: [
            {
                message: {
                    role: 'assistant',
                    content: response.text
                },
                index: 0,
                finish_reason: 'stop',
                logprobs: null,
            }
        ]
    }

    res.json(openaiResponse)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})