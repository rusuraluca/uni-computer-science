//
//  vinylgarageApp.swift
//  vinylgarage
//
//  Created by Rusu Raluca on 10.10.2023.
//

import SwiftUI
import SwiftData

@main
struct vinylgarageApp: App {
    let modelContainer: ModelContainer

    init() {
        do {
            modelContainer = try ModelContainer(for: Record.self)
       } catch {
            fatalError("Could not initialize ModelContainer")
        }
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: Record.self)
    }
}
