import re

TOKEN_L_BRACE = 'LBRACE'
TOKEN_R_BRACE = 'RBRACE'
TOKEN_COMMA = 'COMMA'
TOKEN_COLON = 'COLON'

TOKEN_NODE = 'NODE'
TOKEN_STRING = 'STRING'
TOKEN_ATTRIB = 'ATTRIB'
TOKEN_UNDIR_REL = 'UNDIR_REL'
TOKEN_UNDIR_REL_DSCRBD = 'UNDIR_REL_DSCRBD'
TOKEN_DIR_REL = 'DIR_REL'
TOKEN_DIR_REL_DSCRBD = 'DIR_REL_DSCRBD'

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
            if self.curr_char in ' \t\n':
                self.advance()
            elif self.curr_char == '{':
                tokens.append(Token(TOKEN_L_BRACE))
                self.advance()
            elif self.curr_char == '}':
                tokens.append(Token(TOKEN_R_BRACE))
                self.advance()
            elif self.curr_char == ',':
                tokens.append(Token(TOKEN_COMMA))
                self.advance()
            elif self.curr_char == ':':
                tokens.append(Token(TOKEN_COLON))
                self.advance()
            elif self.curr_char == '-':
                tokens.append(self.make_relationship())
                self.advance()
            elif self.curr_char == "'":
                tokens.append(Token(TOKEN_STRING, self.make_string()))
                self.advance()
            elif re.match('[_a-zA-Z]', self.curr_char):
                tokens.append(Token(TOKEN_NODE, self.make_node()))
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
            return Token(TOKEN_UNDIR_REL)
        elif self.curr_char == '>':
            return Token(TOKEN_DIR_REL)
        elif self.curr_char == "'":
            description = self.make_string()
            self.advance()
            if (self.curr_char == '-'):
                return Token(TOKEN_UNDIR_REL_DSCRBD, description)
            elif (self.curr_char == '>'):
                return Token(TOKEN_DIR_REL_DSCRBD, description)

        return Token(TOKEN_ATTRIB)

    def make_node(self):
        node = self.curr_char
        self.advance()

        while re.match('[_a-zA-Z]', self.curr_char):
            node += self.curr_char
            self.advance()

        return node

def run(text, file_name):
    lexer = Lexer(text, file_name)
    tokens, error = lexer.lex()

    return tokens, error