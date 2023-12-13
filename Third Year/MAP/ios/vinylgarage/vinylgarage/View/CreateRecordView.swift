//
//  CreateRecordView.swift
//  vinylgarage
//
//  Created by Rusu Raluca on 10.10.2023.
//
import SwiftUI
import SwiftData
import PhotosUI

struct CreateRecordView: View {
    
    @Environment(\.dismiss) var dismiss
    @Environment(\.modelContext) var context
    
    @State private var item = Record()
    
    @State var selectedPhoto: PhotosPickerItem?
    
    @State private var showAlert = false
    @State private var alertMessage = ""
    private func validateInput() -> Bool {
        if item.title.isEmpty || item.artist.isEmpty || item.genre.isEmpty || item.releaseYear.words.isEmpty {
            alertMessage = "Title, artist, genre, release year are required fields."
            return false
        }
        return true
    }
    
    var body: some View {
        List {
            Section {
                TextField("Title", text: $item.title)
                TextField("Artist", text: $item.artist)
                TextField("Genre", text: $item.genre)
                Picker("Release Year", selection: $item.releaseYear){
                    ForEach(1850...2023, id: \.self) { year in
                        Text(String(format: "%d", year)).tag(year)
                    }
                }
                DatePicker("Date Aquired", selection: $item.dateAquired, displayedComponents: .date)
            }

            Section {
                if let coverData = item.cover,
                   let uiImage = UIImage(data: coverData) {
                    Image(uiImage: uiImage)
                        .resizable()
                        .scaledToFit()
                        .frame(maxWidth: .infinity, maxHeight: 300)
                }
                
                PhotosPicker(selection: $selectedPhoto,
                             matching: .images,
                             photoLibrary: .shared()) {
                    Label("Add image", systemImage: "photo")
                }
                
                if item.cover != nil {
                    Button(role: .destructive) {
                        withAnimation{
                            selectedPhoto = nil
                            item.cover = nil
                        }
                    } label: {
                        Label("Remove Image", systemImage: "xmark")
                            .foregroundStyle(.red)
                    }
                }
            }
            
            Section {
                Button("Add", systemImage: "plus"){
                    if validateInput() {
                        context.insert(item)
                        dismiss()
                    } else {
                        showAlert = true
                    }
                }
            }
        }
        .alert(isPresented: $showAlert) {
            Alert(
                title: Text("Validation Error"),
                message: Text(alertMessage),
                dismissButton: .default(Text("OK")))
        }
        .task (id: selectedPhoto) {
            if let data = try? await selectedPhoto?.loadTransferable(type: Data.self) {
                item.cover = data
            }
        }
        .navigationTitle("Add record")
    }
}

#Preview {
    CreateRecordView()
}
