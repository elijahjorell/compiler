import re

TT_L_BRACE = 'LBRACE'
TT_R_BRACE = 'RBRACE'
TT_COMMA = 'COMMA'
TT_COLON = 'COLON'
TT_NEWLINE = 'NEWLINE'

TT_ID = 'ID'
TT_STRING = 'STRING'
TT_ATTRIB = 'ATTRIB'
TT_UNDIR_REL = 'UNDIR_REL'
TT_DIR_REL = 'DIR_REL'

class Token:
    def __init__(self, type_, value=None):
        self.type = type_
        self.value = value
    
    def __repr__(self):
        if self.value: return f'{self.type}: {self.value}'
        return f'{self.type}'

class Error:
    def __init__(self, pos_start, pos_end, error_name, details):
        self.pos_start = pos_start
        self.pos_end = pos_end
        self.error_name = error_name
        self.details = details

    def as_string(self):
        result = f'{self.error_name}: {self.details}\n'
        result += f'File {self.pos_start.file_name}, line {self.pos_start.ln + 1}'
        return result

class IllegalCharError(Error):
    def __init__(self, pos_start, pos_end, details):
        super().__init__(pos_start, pos_end, 'Illegal Character', details)

class Position:
    def __init__(self, idx, ln, col, file_name, file_text):
        self.idx = idx
        self.ln = ln
        self.col = col
        self.file_name = file_name
        self.file_text = file_text

    def advance(self, curr_char):
        self.idx += 1
        self.col += 1

        if curr_char == '\n':
            self.ln += 1
            self.col = 0

        return self

    def copy(self):
        return Position(self.idx, self.ln, self.col, self.file_name, self.file_text)


class Lexer:
    def __init__(self, text, file_name):
        self.file_name = file_name
        self.text = text
        self.pos = Position(-1, 0, -1, file_name, text)
        self.curr_char = None
        self.advance()
    
    def advance(self):
        # print(self.curr_char)
        self.pos.advance(self.curr_char)
        self.curr_char = self.text[self.pos.idx] if self.pos.idx < len(self.text) else None

    def lex(self):
        tokens = []

        while self.curr_char != None:
            if self.curr_char in ' \t':
                self.advance()
            elif self.curr_char in '\n':
                tokens.append(Token(TT_NEWLINE))
                self.advance()
            elif self.curr_char == '{':
                tokens.append(Token(TT_L_BRACE))
                self.advance()
            elif self.curr_char == '}':
                tokens.append(Token(TT_R_BRACE))
                self.advance()
            elif self.curr_char == ',':
                tokens.append(Token(TT_COMMA))
                self.advance()
            elif self.curr_char == ':':
                tokens.append(Token(TT_COLON))
                self.advance()
            elif self.curr_char == '-':
                tokens.append(self.make_relationship())
                self.advance()
            elif self.curr_char == "'":
                tokens.append(Token(TT_STRING, self.make_string()))
                self.advance()
            elif re.match('[_a-zA-Z]', self.curr_char):
                tokens.append(Token(TT_ID, self.make_id()))
            else:
                pos_start = self.pos.copy()
                char = self.curr_char
                self.advance()
                return [], IllegalCharError(pos_start, self.pos, "'" + char + "'")

        return tokens, None
                
    def make_string(self):
        string = ''
        self.advance()

        while self.curr_char != "'":
            string += self.curr_char
            self.advance()

        return string

    def make_relationship(self):
        self.advance()

        if self.curr_char == '-':
            return Token(TT_UNDIR_REL)
        elif self.curr_char == '>':
            return Token(TT_DIR_REL)
        elif self.curr_char == "'":
            description = self.make_string()
            self.advance()
            if (self.curr_char == '-'):
                return Token(TT_UNDIR_REL, description)
            elif (self.curr_char == '>'):
                return Token(TT_DIR_REL, description)

        return Token(TT_ATTRIB)

    def make_id(self):
        ID = self.curr_char
        self.advance()

        while re.match('[_a-zA-Z]', self.curr_char):
            ID += self.curr_char
            self.advance()

        return ID

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens

    def parse(self):
        return None

def run(text, file_name):
    lexer = Lexer(text, file_name)
    tokens, error = lexer.lex()
    if error: return None, error

    parser = Parser(tokens)
    ast = parser.parse()

    return tokens, error