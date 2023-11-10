//
// Created by Rusu Raluca on 30.10.2023.
//

#ifndef PDP_LAB2_PRODUCERCONSUMERQUEUE_HPP
#define PDP_LAB2_PRODUCERCONSUMERQUEUE_HPP

#include <condition_variable>
#include <queue>


template <typename T>
class ProducerConsumerQueue {
private:
    std::queue<T> q;
    static const int size = 10;

    std::mutex mtx;
    std::condition_variable queue_not_empty;
    std::condition_variable queue_not_full;

public:
    void enqueue(T val) {
        std::unique_lock<std::mutex> lk(mtx);
        queue_not_full.wait(lk, [this]() {return q.size() < size; });
        q.push(val);
        queue_not_empty.notify_one();
    }

    T dequeue() {
        std::unique_lock<std::mutex> lk(mtx);
        while(true) {
            if(!q.empty()) {
                T result = q.front();
                q.pop();
                queue_not_full.notify_one();
                return result;
            }
            queue_not_empty.wait(lk);
        }
    }
};


#endif //PDP_LAB2_PRODUCERCONSUMERQUEUE_HPP
