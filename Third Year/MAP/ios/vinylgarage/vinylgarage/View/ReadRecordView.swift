//
//  ReadRecordView.swift
//  vinylgarage
//
//  Created by Rusu Raluca on 10.10.2023.
//

import SwiftUI

struct ReadRecordView: View {
    @Environment(\.dismiss) var dismiss
    
    @Bindable var item: Record
    
    private var formattedAquiredDate: String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "dd MMMM, yyyy"
        return dateFormatter.string(from: item.dateAquired)
    }
    
    var body: some View {
        ZStack(alignment: .bottom) {
            if let selectedPhotoData = item.cover,
               let uiImage = UIImage(data: selectedPhotoData) {
                Image(uiImage: uiImage)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            } else {
                Image(systemName: "record.circle")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .symbolRenderingMode(.monochrome)
                    .symbolVariant(.fill)
            }
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                       Text("Title:")
                           .font(.subheadline)
                       Text("Artist:")
                           .font(.subheadline)
                       Text("Genre:")
                           .font(.subheadline)
                       Text("Release Year:")
                           .font(.subheadline)
                       Text("Date Acquired:")
                           .font(.subheadline)
                   }
                   
                   VStack(alignment: .leading, spacing: 4) {
                       Text(item.title)
                           .font(.subheadline).bold()
                       Text(item.artist)
                           .font(.subheadline).bold()
                       Text(item.genre)
                           .font(.subheadline).bold()
                       Text(String(format: "%d", item.releaseYear))
                           .font(.subheadline).bold()
                       Text(formattedAquiredDate)
                           .font(.subheadline).bold()
                   }
                Spacer()
            }
            .padding()
            .foregroundColor(.primary)
            .background(Color.primary
                .colorInvert()
                .opacity(0.75))
        }
    }
}

