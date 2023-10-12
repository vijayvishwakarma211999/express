
import express from "express";
import axios from "axios";
import cheerio from "cheerio";
const app = express();
const PORT = process.env.PORT || 3005;
import urlModule from 'url'
app.get('/', async (req, res) => {
  try {
    const pageTitle = req?.query?.title || "";
    //get query string data
    const urlToFetch = `https://donestat.co/`;
    const url = `https://donestat.co/`;

    // Use axios to fetch HTML content from example.com
    const response = await axios.get(urlToFetch );

    const html = response.data;

      // Load the HTML content into Cheerio
      const $ = cheerio.load(html);

      // Append the <meta> tag to the head
      $('head').append(`<meta property="og:title" content="${pageTitle}"/>`);

      const baseTag = `<base href="${urlToFetch}"/>`;
      $('head').append(baseTag);
      // Update relative href attributes with the full URL
      $('a[href], link[href]').each((index, element) => {
        const href = $(element).attr('href');
        if (href && !urlModule.parse(href).protocol) {
          $(element).attr('href', urlModule.resolve(url, href));
        }
      });
      // Update relative src attributes with the full URL for script tags
      $('script[src]').each((index, element) => {
        const src = $(element).attr('src');
        if (src && !urlModule.parse(src).protocol) {
          $(element).attr('src', urlModule.resolve(url, src));
        }
      });
      // Get the modified HTML content
      const modifiedHtml = $.html();
    // Set the response content type to HTML
    res.setHeader('Content-Type', 'text/html');

    // Send the HTML content as the response
    //res.send(response.data);
    res.send(modifiedHtml);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('An error occurred while fetching data.');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
