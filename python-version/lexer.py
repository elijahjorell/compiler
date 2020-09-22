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
        if self.value: return f'{self.type}:{self.value}'
        return f'{self.type}'

class Lexer:
    def __init__(self, text):
        self.text = text
        self.pos = -1
        self.curr_char = None
        self.advance()
    
    def advance(self):
        self.pos += 1
        self.curr_char = self.text[self.pos] if self.pos < len(self.text) else None

    def lex(self):
        tokens = []

        while self.curr_char != None:
            if self.curr_char in ' \t':
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
                tokens.append(self.make_string())
                self.advance()
            elif re.match('[_a-zA-Z]', self.curr_char):
                tokens.append(self.make_node())
                self.advance()
            

    def make_string(self):
        
        pass

    def make_relationship(self):
        pass

    def make_node(self):
        pass

    