Project Deployed on Render :-    https://certificate-generator-locq.onrender.com





This certificate generator is a web-based tool that allows users to generate personalized student certificates by filling out a simple form.


Step-by-Step Flow
1> User fills the form:
    The form asks for the student’s name, course name, and date.
    When the user clicks "Generate Certificate", the data is sent to the server.

2> Server receives the request:
    The Express backend handles a POST request to /generate.
    It reads a blank certificate template PDF from the /template folder.
    It uses custom fonts (Alex Brush and Ovo ).

3> PDF is dynamically generated:
    Using pdf-lib, the server embeds the user’s name, course, and date into the template.
    Font size is adjusted dynamically to ensure long names or course titles fit well.
    The final PDF is generated entirely in memory (not saved to disk).

4> PDF is returned to the browser:
    The server responds with the PDF as a binary blob (Content-Type: application/pdf).
    This is done since the pdf is generated on the fly and not stored anywhere.
    On the frontend, the browser creates a Blob URL from the PDF.

5> User can view or download:
    Buttons labeled “View” and “Download” appear after the certificate is generated.
    View opens the certificate in a new tab.
    Download lets the user save it into their system.

6> No files are stored on the server:
    The app is fully stateless.
    Each certificate is generated fresh per request.

