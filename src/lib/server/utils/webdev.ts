import { API_URL, API_TOKEN } from '$env/static/private';
import type { FormattedResponse } from '$lib/types/types';



// import { twMerge } from "tailwind-merge"

// function from Shadcn
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// Take a string and encode it in 64 to send to windev64
export function encodeBase64(input: string) {
  try {
    const encoded = btoa(unescape(encodeURIComponent(input)
      .replace(/%C3%A9/g, "%E9")  // "é" → ISO-8859-1
      .replace(/%C3%A8/g, "%E8"))); // "è" → ISO-8859-1
    return encoded
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred in the encodeBase64 function");
  }
  //FUNCTIONAL

}

// Take a string and decode it from 64 to send to windev64
export function decodeBase64(input: string) {
  try {
    const decoded = decodeURIComponent(escape(atob(input)));
    return decoded
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred in the decodeBase64 function");
  }

}


export async function fetchTest() {
  try {
    const url = API_URL
    if (url == null) return

    const SQL = "U0VMRUNUICogRlJPTSBtb3RpZnJkdiBXSEVSRSBOb21BY3Rpdml06SA9ICdBdGVsaWVyUCc="
    // const encodedSQL = encodeBase64(SQL)


    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "token": API_TOKEN
      },
      body: JSON.stringify({ request: SQL }),
    })

    return response

  } catch (error) {
    console.error(error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred in the fetchTest function");
  }
}


// Take a SQL request and send it to the API


export const fetchToApi = async (sqlRequest: string): Promise<FormattedResponse<any>> => {
  try {
    const url = API_URL || 'http://localhost:8024/Requete'
    const headers = {
      'Content-Type': 'application/json',
      'token': API_TOKEN || '',

    }

    // const encodedSql = encodeBase64(sqlRequest)
    const requestBody = JSON.stringify({
      "request": sqlRequest
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: requestBody
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
    }

    const data = await response.json()

    return { success: true, data };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred in the fetchToApi function");
  }

}



