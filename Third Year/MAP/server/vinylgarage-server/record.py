class Record:
    def __init__(self, id, title: str, artist: str, genre: str, releaseYear: int, dateAcquired: str, cover=""):
        self.id = id
        self.title = title
        self.artist = artist
        self.genre = genre
        self.releaseYear = releaseYear
        self.dateAcquired = dateAcquired
        self.cover = cover

    def as_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "artist": self.artist,
            "genre": self.genre,
            "releaseYear": self.releaseYear,
            "dateAcquired": self.dateAcquired,
            "cover": self.cover
        }