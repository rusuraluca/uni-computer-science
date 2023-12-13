//
//  ContentView.swift
//  vinylgarage
//
//  Created by Rusu Raluca on 10.10.2023.
//

import SwiftUI
import SwiftData

struct ContentView: View {
    
    @Environment(\.modelContext) var context
    
    @State private var recordDelete = false
    @State private var record = Record()
        
    @Query(
        sort: \Record.dateAquired,
        order: .reverse
    ) private var items: [Record]
    
    var body: some View {
        NavigationStack {
            Section {
                List{
                    ForEach(items){ item in
                        HStack {
                            NavigationLink(destination: ReadRecordView(item: item)) {
                                if let selectedPhotoData = item.cover,
                                   let uiImage = UIImage(data: selectedPhotoData) {
                                    Image(uiImage: uiImage)
                                        .resizable()
                                        .frame(maxWidth: 50, maxHeight: 50)
                                        .clipShape(RoundedRectangle(cornerRadius: 10))
                                } else {
                                    Image(systemName: "record.circle")
                                        .resizable()
                                        .frame(maxWidth: 50, maxHeight: 50)
                                        .clipShape(Circle())
                                        .symbolRenderingMode(.monochrome)
                                        .symbolVariant(.fill)
                                    
                                }
                                VStack(alignment: .leading) {
                                    Text(item.title)
                                        .font(.headline)
                                    Text(item.artist)
                                        .font(.subheadline)
                                }
                                .swipeActions {
                                    Button {
                                        recordDelete = true
                                        record = item
                                        
                                    } label: {
                                        Label("Delete vinyl", systemImage: "trash")
                                    }
                                    .tint(.red)
                                    
                                    NavigationLink(destination: UpdateRecordView(item: item)) {
                                        Label("Edit vinyl", systemImage: "pencil")
                                    }
                                    .tint(.orange)
                                }
                            }
                        }
                    }
                }
            }
            .toolbar {
                NavigationLink(destination: CreateRecordView()) {
                    Label("Add vinyl", systemImage: "plus")
                        .labelStyle(.iconOnly)
                }
            }
            .alert(isPresented: $recordDelete) {
                Alert(
                    title: Text("Confirm Deletion"),
                    message: Text("Are you sure you want to delete this vinyl record?"),
                    primaryButton: .destructive(
                        Text("Delete"),
                        action: {
                            withAnimation {
                                context.delete(record)
                                recordDelete = false
                                record = Record()
                            }
                        }
                    ),
                    secondaryButton: .cancel()
                )
            }
            .navigationTitle("Vinyl Collection")
        }
    }
}

#Preview {
    ContentView()
        .modelContainer(for: Record.self)
}
