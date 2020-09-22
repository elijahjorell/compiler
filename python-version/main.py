from lexer import Lexer

program = open('program.txt', 'r').read()

lexer = Lexer(program)

lexer.lex()