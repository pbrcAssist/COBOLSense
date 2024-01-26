IDENTIFICATION DIVISION.
PROGRAM-ID. FACTORIAL.
DATA DIVISION.
WORKING-STORAGE SECTION.
01 NUMBER PIC 9(2) VALUE 5.
01 FACTORIAL PIC 9(10) VALUE 1.
PROCEDURE DIVISION.
MAIN-LOGIC.
PERFORM CALCULATE-FACTORIAL UNTIL NUMBER = 0.
    DISPLAY "Factorial of " NUMBER " is " FACTORIAL.
    STOP RUN.
CALCULATE-FACTORIAL.
    MULTIPLY FACTORIAL BY NUMBER.
    SUBTRACT 1 FROM N
    
    ChatCompletionChoice(index=0, message=ChatMessage(role=assistant, content=Sure, here's a sample COBOL code for you:

IDENTIFICATION DIVISION.
PROGRAM-ID. SAMPLE-COBOL-CODE.
DATA DIVISION.
WORKING-STORAGE SECTION.
01 NAME PIC X(30) VALUE 'JOHN DOBSON'.
01 AGE PIC 99 VALUE 30.
01 SALARY PIC 9(7)V99 VALUE 5000.50.
PROCEDURE DIVISION.
DISPLAY 'Name: ' NAME.
DISPLAY 'Age: ' AGE.
DISPLAY 'Salary: ' SALARY.
STOP RUN.

This code declares three variables - NAME, AGE, and SALARY, and initializes them with values. It then displays the values of these variables using the DISPLAY statement. Finally, it stops the program execution with the STOP RUN statement., name=null, functionCall=null), finishReason=stop)
    
    UMBER.Hello, {"prompt":"test"}