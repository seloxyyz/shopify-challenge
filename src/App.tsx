import { useState } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('') // prompt input by user
  const [promptRes, setPromptRes] = useState<any>([]) // prompt result from openai api
  const [engine, setEngine] = useState('text-ada-001')
  const [fetching, setFetching] = useState(false) // button loading while fetching


  const submit = async () => {
    const data = {
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    const key = ''

    try {
      setFetching(true) // set button loading to true

      // get the poem from the openai api
      await fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify(data)
      }).then(async (res) => {
        const resJson = await res.json()
        
        setPromptRes((result: any) => [...result, { response: resJson, prompt: prompt }]) // set the results to setPromptRes
        setFetching(false) // set button loading to false
      })

    } catch (error) {
      alert("Something went wrong:" + error)
      setFetching(false) // set button loading to false
    }
  }

  return (
    <div className='flex justify-center items-center mt-32'>

      <div className='flex flex-col items-center'>
        {/* input that takes text prompts */}
        <p className='text-4xl font-bold'>Enter a prompt</p>
        <p className='mb-10 text-slate-500'>e.g. "write a poem about dinosaurs in the snow"</p>
        <form>
          <div className='flex flex-row items-center'>
            <p className='mr-2 font-semibold'>Choose an engine:</p>
            <select name="engine" id="engine" onChange={(event) => setEngine(event.currentTarget.value)} className='p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500'>
              <option value="text-ada-001">Ada</option>
              <option value="text-babbage-001">Babbage</option>
              <option value="text-curie-001">Curie</option>
              <option value="text-davinci-001">Davinci</option>
              <option value="text-davinci-002">Davinci v2</option>
            </select>
          </div>
          <textarea onChange={(event) => setPrompt(event.currentTarget.value)} className="block w-96 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500" required />

          {/* submit promt to openai api */}
          {fetching === true ?
            <button disabled={fetching} type="button" className="mt-10 mb-10 w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center">
              <svg role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
              </svg>
              Loading...
            </button> :
            <button type='submit' onClick={() => submit()} className="mt-5 mb-10 w-full focus:outline-none text-white bg-green-700 hover:bg-green-800 hover:shadow-xl hover:shadow-green-300/30 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5">Submit</button>
          }
        </form>

        {/* show res from openai api */}
        {promptRes.length > 0 &&
          <div className='mb-10'>
            <p className='text-2xl font-bold mb-2'>Results</p>
            {promptRes.map((res: any) =>
              <div key={res.id} className="mb-5 p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
                <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900">Prompt: {res.prompt}</h5>
                <p className="mb-3 font-normal text-gray-700">Result: {res.response.choices[0].text}</p>
                <p className='text-gray-300'>Engine used: {res.response.model}</p>
              </div>
            )}
          </div>}
      </div>
    </div>
  )
}

export default App
