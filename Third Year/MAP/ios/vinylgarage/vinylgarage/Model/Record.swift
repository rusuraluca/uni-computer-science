//
//  Record.swift
//  vinylgarage
//
//  Created by Rusu Raluca on 10.10.2023.
//

import Foundation
import SwiftData

@Model
class Record {
    var title: String
    var artist: String
    
    //@Relationship(deleteRule: .nullify, inverse: \Genre.records)
    var genre: String
    
    var releaseYear: Int
    var dateAquired: Date
    
    @Attribute(.externalStorage)
    var cover: Data?
    
    init(title: String = "",
         artist: String = "",
         genre: String = "",
         releaseYear: Int = 2023,
         dateAquired: Date = .now,
         cover: Data? = nil) {
        self.title = title
        self.artist = artist
        self.genre = genre
        self.releaseYear = releaseYear
        self.dateAquired = dateAquired
        self.cover = cover
    }
}
