package com.example.backendjsp.repository;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import model.User;

public class UserRepository {
    private static UserRepository instance;
    private EntityManagerFactory entityManagerFactory;
    private UserRepository() {
        entityManagerFactory = Persistence.createEntityManagerFactory("default");
    }

    public static synchronized UserRepository getInstance() {
        if(instance == null) {
            instance = new UserRepository();
        }
        return instance;
    }

    public User getUserByUsernameAndPassword(String username, String password) {
        EntityManager em = entityManagerFactory.createEntityManager();
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<User> cq = cb.createQuery(User.class);
        Root<User> userRoot = cq.from(User.class);

        cq
                .select(userRoot)
                .where(cb.equal(userRoot.get("username"), username), cb.equal(userRoot.get("password"), password));
        TypedQuery<User> tq = em.createQuery(cq);
        try {
            return tq.getSingleResult();
        } catch(NoResultException ex) {
            return null;
        }
    }
}
