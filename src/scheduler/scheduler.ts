

export const dbScheduler = async() => {

    console.log(new Date() + "Running Scheduler !!! ")
    const key = process.env.api_key
    
    const url = "https://openapi.gg.go.kr/Genrestrtchifood?key="+key+"&type=json&pSize=5&pindex=1"

    try {
      const response = await fetch(url, { method: "GET" });

      if (response.ok) {
          const data = await response.text();
          console.log('Raw JSON Response:', data);
      } else {
          console.error('HTTP Error:', response.status, response.statusText);
      }
  } catch (error) {
      console.error('Fetch error:', error);
  }

  };



