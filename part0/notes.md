```mermaid
sequenceDiagram
    participant browser
    participant server

     browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    deactivate server

    Note: After Succesful POST operation the web page updates automatically aka performs GET https://studies.cs.helsinki.fi/exampleapp/notes and the 0.4 example sequence happens again.
```