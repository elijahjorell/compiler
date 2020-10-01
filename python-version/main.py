import lexer
import os
import pprint
pp = pprint.PrettyPrinter(indent=4)

program_path = 'program.txt'

program = open(program_path, 'r').read()

result, error = lexer.run(program, program_path)

if error: print(error.as_string())
# else: pp.pprint(result)

