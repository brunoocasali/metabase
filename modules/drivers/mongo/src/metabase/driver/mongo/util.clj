(ns metabase.driver.mongo.util
  "Mongo specific utility functions -- mongo methods that we are using at various places wrapped into clojure
   functions."
  (:require
   [metabase.driver.mongo.conversion :as mongo.conversion])
  (:import
   (com.mongodb MongoClientSettings)
   (com.mongodb.client ClientSession MongoClient MongoClients MongoCollection MongoDatabase)))

(set! *warn-on-reflection* true)

(defn mongo-client
  "Create `MongoClient` from `MongoClientSettings`."
  ^MongoClient [^MongoClientSettings settings]
  (MongoClients/create settings))

(defn close
  "Close `client`."
  [^MongoClient client]
  (.close client))

(defn database
  "Get database by its name from `client`."
  ^MongoDatabase [^MongoClient client db-name]
  (.getDatabase client db-name))

;; https://mongodb.github.io/mongo-java-driver/4.11/apidocs/mongodb-driver-sync/com/mongodb/client/MongoDatabase.html#runCommand(org.bson.conversions.Bson)
;; Returns Document
(defn run-command
  "Run mongo command."
  ([^MongoDatabase db cmd & {:as opts}]
   (let [cmd-doc (mongo.conversion/to-document cmd)]
     (-> (.runCommand db cmd-doc)
         (mongo.conversion/from-document opts)))))

;; https://mongodb.github.io/mongo-java-driver/4.11/apidocs/mongodb-driver-sync/com/mongodb/client/MongoClient.html#listDatabaseNames()
;; returns MongoIterable<String>
(defn list-database-names
  "Return vector of names of databases for `client`."
  [^MongoClient client]
  (vec (.listDatabaseNames client)))

;; https://mongodb.github.io/mongo-java-driver/4.11/apidocs/mongodb-driver-sync/com/mongodb/client/MongoDatabase.html#listCollectionNames()
(defn list-collection-names
  "Return vector of collection names for `db`"
  [^MongoDatabase db]
  (vec (.listCollectionNames db)))

(defn collection
  "Return `MongoCollection` for `db` by its name."
  ^MongoCollection [^MongoDatabase db coll-name]
  (.getCollection db coll-name))

;; https://mongodb.github.io/mongo-java-driver/4.11/apidocs/mongodb-driver-sync/com/mongodb/client/MongoCollection.html#listIndexes()
(defn list-indexes
  "Return vector of Documets describing indexes."
  [^MongoCollection coll & {:as opts}]
  (mongo.conversion/from-document (.listIndexes coll) opts))

(defn create-index
  "Create index."
  [^MongoCollection coll cmd-map]
  (.createIndex coll (mongo.conversion/to-document cmd-map)))

(defn insert-one
  "Insert document into mongo collection."
  [^MongoCollection coll document-map]
  (.insertOne coll (mongo.conversion/to-document document-map)))

(defn start-session!
  "Start session on client `c`."
  ^ClientSession [^MongoClient c]
  (. c startSession))

(defn kill-session!
  "Kill `session` in `db`."
  [^MongoDatabase db
   ^ClientSession session]
  (let [session-id (.. session getServerSession getIdentifier)
        kill-cmd (mongo.conversion/to-document {:killSessions [session-id]})]
    (.runCommand db kill-cmd)))
